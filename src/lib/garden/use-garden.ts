import { useCallback,useEffect,useState } from 'react';
import { useMemories,addMemory,updateMemory,type Memory } from '@/lib/memories-store';
import { useActiveSpaceId,scopedKey } from '@/lib/active-space';
import { useMemoryPerson } from '@/components/legato/MemoryUI';
import { getDiscovery } from '@/lib/discovery';
import { supabase } from '@/integrations/supabase/client';
import { loadGarden,ensureGarden,createGardenMemory,changeGardenMemory } from '@/lib/garden.functions';
import { approvedMemories,type GardenMemory } from './model';
export function useGarden(){
 const id=useActiveSpaceId();const {name,person}=useMemoryPerson();const local=useMemories();
 const [remote,setRemote]=useState<GardenMemory[]>([]);const [circle,setCircle]=useState<{id:string;owner_id:string}|null>(null);
 const [members,setMembers]=useState<{id:string;user_id:string|null;display_name:string|null;status:string}[]>([]);
 const [user,setUser]=useState<string|null>(null);const [ready,setReady]=useState(false);const [error,setError]=useState('');
 const refresh=useCallback(async()=>{
  setReady(false);setError('');setRemote([]);setCircle(null);setMembers([]);
  if(!id){setReady(true);return;}
  if(getDiscovery().active){setUser(null);setReady(true);return;}
  const {data:s}=await supabase.auth.getSession();setUser(s.session?.user.id??null);
  if(!s.session){setReady(true);return;}
  try{
   const linked=localStorage.getItem(scopedKey('legato.garden-circle.v1'))||undefined;
   const r=await loadGarden({data:{spaceKey:id,circleId:linked}});
   setCircle(r.circle);setMembers(r.members);
   setRemote(r.rows.map(row=>{const p=row.payload as unknown as Memory;return {...p,id:row.id,createdAt:Date.parse(row.created_at),status:row.status as GardenMemory['status'],shared:row.shared,mine:row.author_id===r.userId,filePath:row.file_path??undefined,imageDataUrl:p.type==='photo'?row.url:undefined,audioDataUrl:p.type==='voice'||p.type==='sound'?row.url:undefined};}));
  }catch{setError('Les souvenirs partagés n’ont pas pu être chargés. Réessayez.');}finally{setReady(true);}
 },[id]);
 useEffect(()=>{void refresh();const t=setInterval(()=>void refresh(),240000);return()=>clearInterval(t);},[refresh]);
 const ensure=async()=>{if(circle)return circle.id;if(!id)throw new Error('Choisissez d’abord une parcelle.');const c=await ensureGarden({data:{spaceKey:id,name}});localStorage.setItem(scopedKey('legato.garden-circle.v1'),c.id);await refresh();return c.id;};
 const save=async(input:Omit<Memory,'id'|'createdAt'>,file?:File,shared=false)=>{
  if(!id)throw new Error('Choisissez d’abord une parcelle.');
  let memoryId:string;
  if(user&&!getDiscovery().active){
   const cid=await ensure();const {imageDataUrl,audioDataUrl,composition,...p}=input;
   const r=await createGardenMemory({data:{circleId:cid,payload:p,shared,fileName:file?.name}});memoryId=r.id;
   if(file&&r.path){const {error:e}=await supabase.storage.from('memory-files').upload(r.path,file,{upsert:false,contentType:file.type});if(e)throw new Error('Le fichier n’a pas pu être déposé. Le souvenir reste sans fichier ; réessayez avec un fichier plus petit.');}
   await refresh();
  }else{
   let encoded:string|undefined;
   if(file)encoded=await new Promise<string>((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(String(f.result));f.onerror=reject;f.readAsDataURL(file);});
   const m=addMemory({...input,imageDataUrl:input.type==='photo'?encoded:input.imageDataUrl,audioDataUrl:input.type==='voice'?encoded:input.audioDataUrl});memoryId=m.id;
  }
  localStorage.setItem(scopedKey('legato.garden-last.v1'),memoryId);return memoryId;
 };
 const change=async(m:GardenMemory,patch:{status?:'approved'|'rejected';body?:string})=>{
  if(m.status){await changeGardenMemory({data:{id:m.id,...patch}});await refresh();}else{updateMemory(m.id,patch.body!==undefined?{body:patch.body}:{});}
 };
 const rows: GardenMemory[]=[...remote,...local].sort((a,b)=>b.createdAt-a.createdAt);
 return {rows,memories:approvedMemories(rows),pending:remote.filter(m=>m.status==='pending'&&!m.mine),circle,members,user,owner:!!user&&circle?.owner_id===user,ready,error,name,person,save,change,ensure,refresh};
}
export function readBookSelection():string[]|null {try{return JSON.parse(localStorage.getItem(scopedKey('legato.memory-book.v1'))||'null');}catch{return null;}}
export function writeBookSelection(ids:string[]){localStorage.setItem(scopedKey('legato.memory-book.v1'),JSON.stringify(ids));}
