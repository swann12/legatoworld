import { Link,useNavigate } from '@tanstack/react-router';
import { useEffect,useRef,useState,type ReactNode } from 'react';
import { ArrowRight,ChevronRight,Mic,Square } from 'lucide-react';
import { toast } from 'sonner';
import { StandardLayout,PageTitle,Lead,Row,PrimaryButton,TextLink,OutlineButton,Field,TextArea,Spec } from '@/components/legato/ds';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MemoryExtras } from '@/components/legato/MemoryUI';
import { useGarden,readBookSelection,writeBookSelection } from '@/lib/garden/use-garden';
import { filterMemories,addKinds,type AddKind,type GardenMemory } from '@/lib/garden/model';
import { memoryDate,memoryKind } from '@/lib/memory-garden';
import { scopedKey } from '@/lib/active-space';
import { usePortrait,portraitLabels } from '@/lib/portrait-store';
import { useMemoryPerson } from '@/components/legato/MemoryUI';
import { useActiveSpace } from '@/lib/use-active-space';
import './garden.css';
export function GardenShell({children,back='/care/garden/space',backLabel='Mémoire'}:{children:ReactNode;back?:string;backLabel?:string}){
 return <StandardLayout space="memory" back={back} backLabel={backLabel} activeTab="/care/garden" className="garden-d5">{children}</StandardLayout>;
}
export function Photo({memory,className=''}:{memory?:GardenMemory;className?:string}){
 return memory?.imageDataUrl?<img src={memory.imageDataUrl} alt={memory.title||'Un souvenir'} className={`gd-photo ${className}`}/>:<span className={`gd-photo ${className}`} aria-hidden/>;
}
const titleOf=(m:GardenMemory)=>m.title||m.body?.slice(0,70)||memoryKind(m);
export function GardenHome(){
 const g=useGarden();const latest=g.memories[0];
 const {kind}=useActiveSpace();const animal=kind==='animal';
 return <StandardLayout space="memory" title="Mémoire" activeTab="/care/garden" className="garden-d5">
  <PageTitle className="gd-title">Le jardin<br/> {g.person?.relation==='conjoint'?'de ':/^[aeiouyàâéèêh]/i.test(g.name)?"d'":"de "}<em>{g.person?.relation==='conjoint'?'mon amour':g.name}.</em></PageTitle>
  <Lead className="gd-lead">{g.memories.length?`${g.memories.length} souvenirs · le dernier ajouté ${new Date(latest.createdAt).toLocaleDateString('fr-FR')}${latest.author?` par ${latest.author}`:''}.`:'Son jardin attend le premier souvenir.'}</Lead>
  {latest&&<Link className="gd-latest" to="/care/garden/souvenirs/$id" params={{id:latest.id}} search={{type:undefined}}><Photo memory={latest}/><span><span className="gd-tag block">Dernier souvenir</span><span className="gd-name block mt-1">{titleOf(latest)}</span><span className="gd-sub block mt-1">{memoryKind(latest).toLowerCase()} · {memoryDate(latest)}</span></span><ChevronRight size={14}/></Link>}
  <Row className="gd-row" n={1} icon="arrow" title="Tous ses souvenirs" subtitle="Photos, voix, lettres, lieux" to="/care/garden/souvenirs"/>
  <Row className="gd-row" n={2} icon="arrow" title="Ajouter un souvenir" subtitle="Une photo, sa voix, une phrase, un lieu" to="/care/garden/ajouter"/>
  <Row className="gd-row" n={3} icon="arrow" title="Son portrait" subtitle={animal?"Qui il était, ce qu'il aimait":"Qui elle était, ce qu'elle aimait"} to="/care/garden/portrait"/>
  <Row className="gd-row" n={4} icon="arrow" title="Avec vos proches" subtitle={g.pending.length?`${g.pending.length} souvenirs à regarder`:'Les souvenirs de votre cercle'} to="/care/garden/proches"/>
  <Row className="gd-row" n={5} icon="arrow" title={animal?"Un livre pour lui":"Un livre pour elle"} subtitle="Ses souvenirs, imprimés" to="/care/garden/livre"/>
  <div className="gd-actions"><TextLink to="/care/garden/dates">Ses dates</TextLink><TextLink to="/care/rituels">{animal?"Un geste pour lui":"Un geste pour elle"}</TextLink></div>
  {g.error&&<p role="alert" className="gd-sub mt-4">{g.error}</p>}
  <MemoryExtras><TextLink to="/care/garden">Revenir aux parcelles</TextLink><div className="gd-actions"><TextLink to="/care/garden/depot">L’atelier de composition</TextLink><TextLink to="/care/garden/histoires">Ses histoires</TextLink><TextLink to="/care/garden/recettes">Ses recettes</TextLink><TextLink to="/home/ses-affaires">Ses affaires</TextLink></div></MemoryExtras>
 </StandardLayout>;
}
export function MemoriesPage({filter='tout'}:{filter?:string}){
 const g=useGarden();const rows=filterMemories(g.memories,filter);
 return <GardenShell><PageTitle className="gd-title">{filter==='photo'?'Ses photos.':filter==='voix'?'Sa voix.':filter==='lettre'?'Ses lettres.':filter==='lieu'?'Ses lieux.':<>Tous ses<br/><em>souvenirs.</em></>}</PageTitle>
 <nav className="gd-tabs" aria-label="Types de souvenirs">{[['tout','Tout'],['photo','Photos'],['voix','Voix'],['lettre','Lettres'],['lieu','Lieux']].map(([id,label])=><Link key={id} to="/care/garden/souvenirs" search={{type:id==='tout'?undefined:id}} aria-current={filter===id}>{label}</Link>)}</nav>
 {filter==='photo'?<div className="gd-grid">{rows.map(m=><Link key={m.id} to="/care/garden/souvenirs/$id" params={{id:m.id}} search={{type:undefined}}><Photo memory={m}/><p className="gd-name mt-2">{titleOf(m)}</p><p className="gd-sub">{memoryDate(m)}</p></Link>)}</div>:rows.map(m=>filter==='voix'?<article className="gd-review" key={m.id}><Link to="/care/garden/souvenirs/$id" params={{id:m.id}} search={{type:undefined}} className="gd-name">{titleOf(m)}</Link><p className="gd-sub mt-1">{m.body}</p>{m.audioDataUrl?<audio controls className="gd-audio" src={m.audioDataUrl} preload="metadata"/>:<p className="gd-sub mt-2">Le fichier audio n’est pas disponible.</p>}</article>:<Link key={m.id} className="gd-list-item" to={m.type==='voice'?'/care/garden/souvenirs':'/care/garden/souvenirs/$id'} params={{id:m.id}} search={{type:m.type==='voice'?'voix':undefined}}><span><span className="gd-tag block">{memoryKind(m)}</span><span className="gd-name block mt-1">{titleOf(m)}</span><span className="gd-sub block mt-1">{memoryDate(m)}{m.author?` · ajouté par ${m.author}`:''}</span></span><ChevronRight size={14}/></Link>)}
 {!rows.length&&g.ready&&<Lead className="mt-8">Aucun souvenir dans cette catégorie, pour le moment.</Lead>}
 {filter!=='photo'&&<div className="gd-actions"><PrimaryButton to={filter==='voix'?'/care/garden/ajouter/voix':'/care/garden/ajouter'}>{filter==='voix'?'Ajouter un enregistrement':'Ajouter un souvenir'}</PrimaryButton></div>}
 {g.error&&<p role="alert">{g.error}</p>}</GardenShell>;
}
export function MemoryDetail({id}:{id:string}){
 const g=useGarden();const m=g.memories.find(m=>m.id===id);const [edit,setEdit]=useState(false);const [body,setBody]=useState('');const navigate=useNavigate();
 if(!m)return <GardenShell back="/care/garden/souvenirs" backLabel="Tous ses souvenirs"><PageTitle className="gd-title">{g.ready?'Souvenir indisponible.':'Un instant…'}</PageTitle><Lead className="gd-lead">{g.ready?'Ce souvenir n’est pas accessible dans cette parcelle.':''}</Lead></GardenShell>;
 const share=async()=>{try{const text=[m.title,m.body,m.when,m.place].filter(Boolean).join('\n\n');if(navigator.share)await navigator.share({title:m.title,text});else{await navigator.clipboard.writeText(text);toast.success('Les mots sont copiés.');}}catch{toast.info('Le partage n’a pas abouti.');}};
 return <GardenShell back="/care/garden/souvenirs" backLabel="Tous ses souvenirs">{m.type==='photo'&&<Photo memory={m} className="gd-detail-photo"/>}<PageTitle className="gd-title" size={30}>{titleOf(m).replace(/[.]+$/,'')}.</PageTitle>{m.body&&<p className="gd-quote mt-3">« {m.body} »</p>}{m.audioDataUrl&&<audio controls src={m.audioDataUrl} className="gd-audio"/>}
 <Spec className="mt-6" items={[{label:'Quand',value:memoryDate(m)},{label:'Où',value:m.place||'Non précisé'},{label:'Ajouté par',value:m.author||'Vous'}]}/>
 <div className="gd-actions"><OutlineButton disabled={!!m.status&&!g.owner} onClick={()=>{setBody(m.body||'');setEdit(!edit);}}>Ajouter un mot</OutlineButton><TextLink onClick={()=>{const chosen=readBookSelection()??g.memories.map(x=>x.id);writeBookSelection(Array.from(new Set([...chosen,m.id])));void navigate({to:'/care/garden/livre'});}}>Mettre dans le livre</TextLink><TextLink onClick={()=>void share()}>Partager</TextLink></div>
 {edit&&<form className="gd-form" onSubmit={async e=>{e.preventDefault();try{await g.change(m,{body});setEdit(false);toast.success('C’est gardé.');}catch(e){toast.error((e as Error).message);}}}><TextArea aria-label="Quelques mots" label="Quelques mots" value={body} onChange={e=>setBody(e.target.value)}/><PrimaryButton type="submit">Garder ces mots</PrimaryButton></form>}
 <MemoryExtras><TextLink to="/care/garden/$zone/$id" params={{zone:m.zone,id:m.id}}>Autres options du souvenir</TextLink></MemoryExtras></GardenShell>;
}
export function AddChoices(){return <GardenShell><PageTitle className="gd-title">Que voulez-vous<br/><em>garder ?</em></PageTitle><Lead className="gd-lead">Un souvenir peut être très simple : une phrase, un son, une image.</Lead><div className="mt-5">{[['photo','Une photo','depuis votre téléphone'],['voix','Sa voix','un message, un enregistrement'],['phrase','Une phrase',"qu’elle disait, une lettre"],['lieu','Un lieu','un endroit qui compte'],['objet','Un objet','une photo et son histoire'],['date','Une date','un moment à retenir']].map(([type,title,subtitle])=><Row key={type} title={title} subtitle={subtitle} to={type==='date'?'/care/garden/dates':type==='photo'?'/care/garden/ajouter/photo':type==='voix'?'/care/garden/ajouter/voix':'/care/garden/ajouter/$type'} params={{type}}/>)}</div></GardenShell>;}
export function AddForm({kind}:{kind:string}){
 const k=addKinds.includes(kind as AddKind)?kind as AddKind:null;
 const g=useGarden();const {updateSpace}=useMemoryPerson();const navigate=useNavigate();
 const input=useRef<HTMLInputElement>(null);const recorder=useRef<MediaRecorder|null>(null);const tracks=useRef<MediaStream|null>(null);
 const [file,setFile]=useState<File>();const [preview,setPreview]=useState('');const [title,setTitle]=useState('');const [body,setBody]=useState('');const [when,setWhen]=useState('');const [place,setPlace]=useState('');const [shared,setShared]=useState(false);const [busy,setBusy]=useState(false);const [recording,setRecording]=useState(false);const [seconds,setSeconds]=useState(0);const [error,setError]=useState('');
 useEffect(()=>{if(!file){setPreview('');return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);
 useEffect(()=>{if(!recording)return;const t=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(t);},[recording]);
 useEffect(()=>()=>{if(recorder.current?.state==='recording')recorder.current.stop();tracks.current?.getTracks().forEach(t=>t.stop());},[]);
 const select=(f?:File)=>{if(!f)return;if(f.size>50*1024*1024){setError('Choisissez un fichier de moins de 50 Mo.');return;}if(k==='voix'?!/^(audio|video)\//.test(f.type):!f.type.startsWith('image/')){setError('Ce format de fichier ne convient pas.');return;}setFile(f);setError('');};
 const record=async()=>{if(recording){recorder.current?.stop();setRecording(false);return;}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});tracks.current=stream;const r=new MediaRecorder(stream);recorder.current=r;const chunks:Blob[]=[];r.ondataavailable=e=>chunks.push(e.data);r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());setFile(new File(chunks,'sa-voix.webm',{type:r.mimeType||'audio/webm'}));};setSeconds(0);setRecording(true);r.start();}catch{setError('Autorisez le microphone pour enregistrer sa voix.');}};
 if(!k)return <GardenShell><PageTitle className="gd-title">Ce choix n’existe pas.</PageTitle></GardenShell>;
 const save=async()=>{setBusy(true);setError('');try{
  if((k==='photo'||k==='voix')&&!file)throw new Error('Choisissez ou enregistrez un fichier.');
  if(k==='date'&&(!when||!title.trim()))throw new Error('Indiquez une date et son nom.');
  if(k!=='photo'&&k!=='voix'&&k!=='date'&&!body.trim()&&!title.trim())throw new Error('Ajoutez quelques mots pour ce souvenir.');
  const id=await g.save({zone:k==='phrase'?'citation':k,type:k==='photo'||k==='objet'?'photo':k==='voix'?'voice':k==='phrase'?'sentence':'text',title:title.trim()||body.slice(0,80)||'Sa voix',body,when,place,durationSec:k==='voix'?seconds:undefined},file,shared);
  if(k==='date'&&g.person)updateSpace(g.person.id,{customDates:[...g.person.customDates,{id,label:title,date:when}]});
  await navigate({to:'/care/garden/ajouter/fait',search:{id}});
 }catch(e){setError((e as Error).message);}finally{setBusy(false);}};
 return <GardenShell back="/care/garden/ajouter" backLabel="Ajouter un souvenir"><PageTitle className="gd-title">{{photo:'Une photo.',voix:'Sa voix.',phrase:'Une phrase.',lieu:'Un lieu.',objet:'Un objet.',date:'Une date.',recette:'Une recette.'}[k]}</PageTitle>
 {k==='voix'&&<Lead className="gd-lead">Un message vocal, un répondeur, une vidéo : importez-le, ou enregistrez-le en le faisant jouer près du téléphone.</Lead>}
 <input ref={input} type="file" hidden accept={k==='voix'?'audio/*,video/*':'image/*'} onChange={e=>select(e.target.files?.[0])}/>
 {(k==='photo'||k==='objet')&&<Button variant="ghost" className="gd-upload" onClick={()=>input.current?.click()}>{preview?<img src={preview} alt="Photo choisie"/>:'Choisir une photo'}</Button>}
 {k==='voix'&&<><div className="gd-recorder"><Button variant="outline" size="icon" aria-label={recording?'Arrêter l’enregistrement':'Enregistrer sa voix'} onClick={()=>void record()}>{recording?<Square/>:<Mic/>}</Button><span className="gd-clock">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</span></div><TextLink onClick={()=>input.current?.click()}>Importer un fichier plutôt</TextLink>{preview&&<audio controls src={preview} className="gd-audio"/>}</>}
 <form className="gd-form" onSubmit={e=>{e.preventDefault();void save();}}>
 {k==='phrase'?<><TextArea label="Une phrase" placeholder="« Tu verras, ça ira. »" value={body} onChange={e=>setBody(e.target.value)}/><Field label="Quand la disait-elle ?" value={when} onChange={e=>setWhen(e.target.value)} placeholder="Quand j’étais inquiet"/><Field label="Un mot pour la situer · facultatif" value={place} onChange={e=>setPlace(e.target.value)} placeholder="Le soir, dans la cuisine"/></>:<><Field label="Un titre" value={title} onChange={e=>setTitle(e.target.value)} placeholder={k==='voix'?'Au téléphone, en mars':k==='photo'?'Le dimanche à Cassis':undefined}/>{k!=='voix'&&<Field label="Quand" type={k==='date'?'date':'text'} value={when} onChange={e=>setWhen(e.target.value)} placeholder={k==='photo'?'Juillet 2024':undefined}/>} {k!=='voix'&&k!=='date'&&<TextArea label={k==='lieu'?'Le lieu et son histoire':'Quelques mots · facultatif'} value={body} onChange={e=>setBody(e.target.value)} placeholder="Ce que vous voulez garder de ce moment…"/>}{k==='lieu'&&<Field label="Où" value={place} onChange={e=>setPlace(e.target.value)}/>}</>}
 {g.user&&g.owner&&<label className="flex items-center justify-between gap-4"><span><span className="gd-name block">Visible par votre cercle</span><span className="gd-sub">Les membres pourront le voir après validation</span></span><Switch checked={shared} onCheckedChange={setShared}/></label>}
 {!g.user&&<p className="gd-sub">Ce souvenir reste sur cet appareil.</p>}
 {error&&<p role="alert">{error}</p>}<div><PrimaryButton type="submit" disabled={busy||recording||!g.ready}>{busy?'Enregistrement…':'Garder ce souvenir'}</PrimaryButton></div></form></GardenShell>;
}
export function SavedMemory({id}:{id?:string}){
 const g=useGarden();const [last,setLast]=useState(id);useEffect(()=>setLast(id||localStorage.getItem(scopedKey('legato.garden-last.v1'))||undefined),[id,g.person?.id]);const m=g.rows.find(m=>m.id===last);
 return <GardenShell><PageTitle className="gd-title">{m?.status==='pending'?<>C’est proposé<br/><em>à son jardin.</em></>:<>C’est gardé<br/><em>dans son jardin.</em></>}</PageTitle><Lead className="gd-lead">{m?`« ${titleOf(m)} » ${m.status==='pending'?'attend la validation du propriétaire.':`rejoint ses autres souvenirs.${m.shared?' Votre cercle le verra.':''}`}`:'Votre souvenir a été gardé.'}</Lead><div className="gd-actions">{m&&m.status!=='pending'&&<PrimaryButton to="/care/garden/souvenirs/$id" params={{id:m.id}}>Voir le souvenir</PrimaryButton>}<TextLink to="/care/garden/ajouter">Ajouter un autre souvenir</TextLink></div></GardenShell>;
}
export function PortraitPage(){
 const {name,person}=useMemoryPerson();const {portrait,update}=usePortrait();const labels=portraitLabels(portrait);const [edit,setEdit]=useState(false);const [loves,setLoves]=useState('');const [words,setWords]=useState('');const [music,setMusic]=useState('');const [food,setFood]=useState('');
 const p=portrait as typeof portrait & {words?:string;food?:string};
 const specs=[{label:'Elle aimait',value:labels.loves.join(', ')||'À compléter'},{label:'Ses mots',value:p.words||'À compléter'},{label:'Sa musique',value:labels.music.join(', ')||'À compléter'},{label:'Son plat',value:p.food||'À compléter'}];
 return <GardenShell><p className="gd-tag mt-6">{[person?.birthday?.slice(0,4),person?.deathDate?.slice(0,4)].filter(Boolean).join(' – ')}{person?.relation==='conjoint'?' · Votre épouse':''}</p><PageTitle className="gd-title">{name},<br/><em>{person?.relation==='conjoint'?'mon amour.':'son portrait.'}</em></PageTitle><Spec className="mt-6" items={specs}/><Lead className="gd-lead mt-5">Présence s'appuie sur ce portrait pour vous proposer des rituels, des textes et des fleurs qui lui ressemblent.</Lead><div className="gd-actions"><PrimaryButton onClick={()=>{setLoves(labels.loves.join(', '));setMusic(labels.music.join(', '));setWords(p.words||'');setFood(p.food||'');setEdit(!edit);}}>Modifier le portrait</PrimaryButton></div>
 {edit&&<form className="gd-form" onSubmit={e=>{e.preventDefault();update({loves:loves.split(',').map(x=>x.trim()).filter(Boolean),music:music.split(',').map(x=>x.trim()).filter(Boolean),words,food});setEdit(false);toast.success('C’est gardé.');}}><Field label="Elle aimait" value={loves} onChange={e=>setLoves(e.target.value)}/><Field label="Ses mots" value={words} onChange={e=>setWords(e.target.value)}/><Field label="Sa musique" value={music} onChange={e=>setMusic(e.target.value)}/><Field label="Son plat" value={food} onChange={e=>setFood(e.target.value)}/><OutlineButton type="submit">Garder le portrait</OutlineButton></form>}
 <MemoryExtras><TextLink to="/profile/portrait">Le questionnaire du portrait</TextLink></MemoryExtras></GardenShell>;
}
export function RelativesPage(){
 const g=useGarden();return <GardenShell><PageTitle className="gd-title">Avec vos proches.</PageTitle><Lead className="gd-lead">Ils peuvent ajouter leurs souvenirs. Rien n'apparaît sans votre accord.</Lead>{g.pending.length>0&&<div className="gd-panel"><p className="gd-quote">À regarder —</p><p className="gd-name mt-3">{g.pending.length} souvenirs à regarder</p><TextLink className="block mt-4" to="/care/garden/proches/valider">Les regarder</TextLink></div>}
 {g.members.filter(m=>m.user_id!==g.user).map(m=><div className="gd-member" key={m.id}><span className="gd-avatar">{(m.display_name||'P')[0]}</span><span className="flex-1"><span className="gd-name block">{m.display_name||'Un proche'}</span><span className="gd-sub">Votre cercle</span></span><span className="gd-tag">{m.status==='active'?'Membre':'En attente'}</span></div>)}
 {!g.members.length&&g.ready&&<Lead className="mt-6">{g.user?'Vous pouvez inviter un proche à partager ses souvenirs.':'Connectez-vous pour retrouver et inviter votre cercle.'}</Lead>}
 <div className="gd-actions"><TextLink to="/care/garden/invite">+ Inviter quelqu'un</TextLink>{g.owner&&<TextLink to="/care/garden/proches/valider">Les regarder</TextLink>}</div>{g.error&&<p role="alert">{g.error}</p>}</GardenShell>;
}
export function ReviewPage(){
 const g=useGarden();const author=g.pending[0]?.author||'vos proches';return <GardenShell back="/care/garden/proches" backLabel="Avec vos proches"><PageTitle className="gd-title">Les souvenirs<br/><em>de {author}.</em></PageTitle><Lead className="gd-lead">Choisissez ceux qui rejoignent son jardin. Rien n'apparaît sans votre accord.</Lead>{g.pending.map(m=><article className="gd-review" key={m.id}><p className="gd-tag">{memoryKind(m)} · {memoryDate(m)}</p>{m.imageDataUrl&&<Photo memory={m} className="mt-3"/>}<p className="gd-name mt-3">{titleOf(m)}</p><p className="gd-quote mt-2">{m.body}</p>{m.audioDataUrl&&<audio controls src={m.audioDataUrl} className="gd-audio"/>}<div className="gd-actions">{['approved','rejected'].map(status=><OutlineButton key={status} disabled={!g.owner} onClick={()=>void g.change(m,{status:status as 'approved'|'rejected'}).then(()=>toast.success(status==='approved'?'C’est gardé.':'Ce souvenir ne sera pas affiché.')).catch(e=>toast.error(e.message))}>{status==='approved'?'Garder':'Ne pas afficher'}</OutlineButton>)}</div></article>)}{!g.pending.length&&g.ready&&<Lead className="mt-8">Aucun souvenir à valider pour le moment.</Lead>}{g.error&&<p role="alert">{g.error}</p>}</GardenShell>;
}
export function DatesPage(){const {person}=useMemoryPerson();const dates=[...(person?.birthday?[{id:'birthday',label:'Son anniversaire',date:person.birthday}]:[]),...(person?.deathDate?[{id:'death',label:'Le jour de son départ',date:person.deathDate}]:[]),...(person?.customDates||[])];return <GardenShell><PageTitle className="gd-title">Ses dates.</PageTitle><Lead className="gd-lead">Ses dates pour vous proposer un geste, si vous le souhaitez.</Lead>{dates.map(d=><div className="gd-date" key={d.id}><span className="gd-date-number"><strong>{new Date(d.date+'T12:00:00').getDate()}</strong><span>{new Date(d.date+'T12:00:00').toLocaleDateString('fr-FR',{month:'short'}).toUpperCase()}</span></span><span><span className="gd-name block">{d.label}</span><span className="gd-sub">{new Date(d.date+'T12:00:00').toLocaleDateString('fr-FR',{year:'numeric'})}</span></span></div>)}{!dates.length&&<Lead className="mt-6">Une date qui compte peut être gardée ici.</Lead>}<div className="gd-actions"><PrimaryButton to="/care/garden/ajouter/$type" params={{type:'date'}}>Ajouter une date</PrimaryButton><TextLink to="/care/rituels">Préparer un geste</TextLink></div></GardenShell>;}
