import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Json } from '@/integrations/supabase/types';
const scope = z.object({spaceKey:z.string().min(1).max(100), circleId:z.string().uuid().optional()});
export const loadGarden = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((d: z.input<typeof scope>)=>scope.parse(d)).handler(async({data,context})=>{
 const q=context.supabase.from('circles').select('*');
 const {data:circle,error}= data.circleId ? await q.eq('id',data.circleId).maybeSingle() : await q.eq('owner_id',context.userId).eq('memory_space_key',data.spaceKey).maybeSingle();
 if(error)throw new Error('Le jardin ne peut pas être chargé.');
 if(!circle)return {circle:null,rows:[],members:[],userId:context.userId};
 const [{data:rows,error:e},{data:members,error:me}]=await Promise.all([
 context.supabase.from('garden_memories').select('*').eq('circle_id',circle.id).order('created_at',{ascending:false}),
 context.supabase.from('circle_members').select('id,user_id,display_name,status,role').eq('circle_id',circle.id)]);
 if(e||me)throw new Error('Les souvenirs ne peuvent pas être chargés.');
 const signed=await Promise.all((rows??[]).map(async r=>{
  let url:string|undefined;
  if(r.file_path){const {data:s,error:se}=await context.supabase.storage.from('memory-files').createSignedUrl(r.file_path,300);if(!se)url=s.signedUrl;}
  return {...r,url};
 }));
 return {circle,rows:signed,members:members??[],userId:context.userId};
});
export const ensureGarden = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((d:{spaceKey:string;name:string})=>scope.extend({name:z.string().min(1).max(80)}).parse(d)).handler(async({data,context})=>{
 const {data:old,error:oe}=await context.supabase.from('circles').select('id').eq('owner_id',context.userId).eq('memory_space_key',data.spaceKey).maybeSingle();
 if(oe)throw new Error('Le jardin ne peut pas être préparé.');
 if(old)return old;
 const {data:circle,error}=await context.supabase.from('circles').insert({owner_id:context.userId,name:`Le jardin de ${data.name}`,defunt_name:data.name,memory_space_key:data.spaceKey}).select('id').single();
 if(error)throw new Error('Le jardin ne peut pas être préparé.');
 const {error:me}=await context.supabase.from('circle_members').insert({circle_id:circle.id,user_id:context.userId,role:'owner',status:'active'});
 if(me)throw new Error('Le cercle ne peut pas être préparé.');
 return circle;
});
const payload = z.object({zone:z.string().max(40),type:z.enum(['photo','voice','sentence','text','sound']),title:z.string().max(200).optional(),body:z.string().max(20000).optional(),when:z.string().max(100).optional(),place:z.string().max(300).optional(),durationSec:z.number().nonnegative().max(86400).optional(),author:z.string().max(100).optional()});
export const createGardenMemory = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((d:{circleId:string;payload:z.input<typeof payload>;shared:boolean;fileName?:string})=>z.object({circleId:z.string().uuid(),payload,shared:z.boolean(),fileName:z.string().max(200).optional()}).parse(d)).handler(async({data,context})=>{
 const {data:c,error:ce}=await context.supabase.from('circles').select('owner_id').eq('id',data.circleId).single();
 if(ce||!c)throw new Error('Ce jardin ne vous est pas accessible.');
 const owner=c.owner_id===context.userId;
 const id=crypto.randomUUID();const path=data.fileName?`${data.circleId}/${id}/${data.fileName.replace(/[^a-zA-Z0-9._-]/g,'_')}`:null;
 const {error}=await context.supabase.from('garden_memories').insert({id,circle_id:data.circleId,author_id:context.userId,status:owner?'approved':'pending',shared:owner?data.shared:true,payload:data.payload,file_path:path});
 if(error)throw new Error('Le souvenir n’a pas pu être gardé.');
 return {id,path,status:owner?'approved':'pending'};
});
export const changeGardenMemory = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((d:{id:string;status?:'approved'|'rejected';body?:string})=>z.object({id:z.string().uuid(),status:z.enum(['approved','rejected']).optional(),body:z.string().max(20000).optional()}).parse(d)).handler(async({data,context})=>{
 const {data:old,error:e}=await context.supabase.from('garden_memories').select('payload').eq('id',data.id).single();
 if(e)throw new Error('Ce souvenir n’est pas accessible.');
 const patch: {status?:string;payload?:Json}={};
 if(data.status)patch.status=data.status;
 if(data.body!==undefined)patch.payload={...(old.payload as Record<string,Json>),body:data.body};
 const {data:row,error}=await context.supabase.from('garden_memories').update(patch).eq('id',data.id).select('id').single();
 if(error||!row)throw new Error('Seul le propriétaire peut valider ou modifier ce souvenir.');
 return {ok:true};
});
