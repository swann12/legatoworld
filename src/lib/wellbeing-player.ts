import {useSyncExternalStore} from 'react';
import {findSound,readSoundPrefs,writeSoundPrefs,FADE_SECONDS,type Mix} from './wellbeing-sounds';
type State={id:string;playing:boolean;loading:boolean;elapsed:number;duration:number;error:string|null};
const initial:State={id:'rain',playing:false,loading:false,elapsed:0,duration:1800,error:null};
let state=initial; let audio:HTMLAudioElement|null=null;let objectUrl:string|null=null;let generation=0;
const listeners=new Set<()=>void>();
function update(next:Partial<State>) {state={...state,...next};listeners.forEach(fn=>fn());}
export function useWellbeingPlayer(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn);};},()=>state,()=>initial);}
function wav(samples:Float32Array,rate:number){const data=new ArrayBuffer(44+samples.length*2);const v=new DataView(data);const str=(pos:number,s:string)=>{for(let i=0;i<s.length;i++)v.setUint8(pos+i,s.charCodeAt(i));};str(0,'RIFF');v.setUint32(4,36+samples.length*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,samples.length*2,true);for(let i=0;i<samples.length;i++)v.setInt16(44+i*2,Math.max(-1,Math.min(1,samples[i]))*32767,true);return new Blob([data],{type:'audio/wav'});}
export async function playWellbeing(id:string,minutes?:number,mix?:Mix){
 const token=++generation; const prefs=readSoundPrefs();const selected=findSound(id);if(!selected&&id!=='mix'){update({error:'Ce son n’est pas disponible.'});return;}
 const duration=(minutes??(id==='mix'?prefs.minutes:selected?.minutes??30))*60;
 audio?.pause();update({id,playing:false,loading:true,elapsed:0,duration,error:null});
 // A persistent native element reads the prepared file; rendering uses an offline context.
 if(!audio){audio=new Audio();audio.preload='auto';audio.addEventListener('timeupdate',()=>{if(audio)update({elapsed:audio.currentTime});});audio.addEventListener('ended',()=>update({playing:false,elapsed:state.duration}));audio.addEventListener('pause',()=>update({playing:false}));audio.addEventListener('play',()=>update({playing:true}));audio.addEventListener('error',()=>update({playing:false,loading:false,error:'Le son ne peut pas être lu. Réessayez.'}));}
 try {
 const rate=8000;const context=new OfflineAudioContext(1,Math.max(1,Math.ceil((duration||60)*rate)),rate);
 const levels=id==='mix'?(mix??prefs.savedMix??prefs.mix):{[id]:80};
 const total=Math.max(100,Object.values(levels).reduce((a,b)=>a+b,0));
 await Promise.all(Object.entries(levels).filter(([,v])=>v>0).map(async([key,value])=>{const s=findSound(key);if(!s)return;const response=await fetch(s.url);if(!response.ok)throw new Error('audio unavailable');const buffer=await context.decodeAudioData(await response.arrayBuffer());const source=context.createBufferSource();source.buffer=buffer;source.loop=true;const gain=context.createGain();gain.gain.value=value/total;source.connect(gain).connect(context.destination);if(duration&&prefs.fade){const fadeStart=Math.max(0,duration-FADE_SECONDS);gain.gain.setValueAtTime(value/total,fadeStart);gain.gain.linearRampToValueAtTime(0,duration);}source.start();}));
 const rendered=await context.startRendering();if(token!==generation)return;
 if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(wav(rendered.getChannelData(0),rate));
 audio.src=objectUrl;audio.loop=duration===0;audio.volume=1;await audio.play();
 prefs.last=id;prefs.counts[id]=(prefs.counts[id]??0)+1;writeSoundPrefs(prefs);update({loading:false,playing:true});
 if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:selected?.title??'Votre ambiance',artist:'Legato'});navigator.mediaSession.setActionHandler('play',()=>{void resumeWellbeing();});navigator.mediaSession.setActionHandler('pause',pauseWellbeing);navigator.mediaSession.setActionHandler('stop',stopWellbeing);}
 }catch{if(token===generation)update({loading:false,playing:false,error:'La lecture n’a pas commencé. Touchez Lecture pour réessayer.'});}
}
export function pauseWellbeing(){audio?.pause();}
export async function resumeWellbeing(){if(audio?.src){try{await audio.play();}catch{update({error:'Touchez Lecture pour autoriser le son.'});}}else await playWellbeing(state.id,state.duration/60);}
export function stopWellbeing(){generation++;audio?.pause();if(audio)audio.currentTime=0;update({playing:false,loading:false,elapsed:0});}
export function currentSoundId(){return state.id;}
