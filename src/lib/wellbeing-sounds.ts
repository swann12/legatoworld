import rain from '@/assets/sounds/rain.wav.asset.json';
import sea from '@/assets/sounds/sea.wav.asset.json';
import forest from '@/assets/sounds/forest.wav.asset.json';
import white from '@/assets/sounds/white.wav.asset.json';
import piano from '@/assets/sounds/piano.wav.asset.json';
import fire from '@/assets/sounds/fire.wav.asset.json';
import breath from '@/assets/sounds/breath.wav.asset.json';
import anxiety from '@/assets/sounds/anxiety.wav.asset.json';
import body from '@/assets/sounds/body.wav.asset.json';
import sleep from '@/assets/sounds/sleep.wav.asset.json';
export const SOUNDS = [
 {id:'rain',title:'Pluie sur le toit',subtitle:'régulière, sans orage',minutes:45,url:rain.url},
 {id:'sea',title:'La mer, la nuit',subtitle:'vagues lentes',minutes:30,url:sea.url},
 {id:'forest',title:'Forêt au matin',subtitle:'oiseaux au loin',minutes:20,url:forest.url},
 {id:'white',title:'Bruit blanc doux',subtitle:'pour couvrir les bruits',minutes:0,url:white.url},
 {id:'breath',title:'Respirer : quatre, puis six',subtitle:"quand tout s'accélère",minutes:3,url:breath.url},
 {id:'anxiety',title:"Quand l'angoisse monte",subtitle:'pour la laisser redescendre',minutes:5,url:anxiety.url},
 {id:'body',title:'Détendre tout le corps',subtitle:'des pieds à la tête',minutes:10,url:body.url},
 {id:'sleep',title:"Pour s'endormir",subtitle:'une voix qui ralentit',minutes:15,url:sleep.url},
 {id:'piano',title:'Piano doux',subtitle:'',minutes:30,url:piano.url},
 {id:'fire',title:'Feu de cheminée',subtitle:'',minutes:30,url:fire.url},
];
export type Mix = Record<string,number>;
export const DEFAULT_MIX: Mix = {rain:70,sea:30,piano:15,fire:0};
export const TIMER_OPTIONS = [15,30,45,60,0];
export const FADE_SECONDS = 120;
export const durationLabel = (m:number) => m === 0 ? 'Toute la nuit' : m === 60 ? '1 heure' : `${m} min`;
export function endingGain(seconds:number,duration:number,fade:boolean) { return duration === 0 || !fade ? 1 : Math.max(0, Math.min(1,(duration-seconds)/FADE_SECONDS)); }
export const findSound = (id:string) => SOUNDS.find(s=>s.id===id);
export type SoundPreferences = {minutes:number;fade:boolean;darken:boolean;mix:Mix;favorites:string[];savedMix:Mix|null;last:string;counts:Record<string,number>};
export const DEFAULT_PREFS:SoundPreferences = {minutes:30,fade:true,darken:true,mix:DEFAULT_MIX,favorites:[],savedMix:null,last:'rain',counts:{}};
const KEY='legato.wellbeing-sounds.v1';
export function readSoundPrefs():SoundPreferences { try { const value=JSON.parse(localStorage.getItem(KEY)||'null'); return value ? {...DEFAULT_PREFS,...value} : DEFAULT_PREFS; } catch {return DEFAULT_PREFS;} }
export function writeSoundPrefs(value:SoundPreferences) { localStorage.setItem(KEY,JSON.stringify(value)); }
