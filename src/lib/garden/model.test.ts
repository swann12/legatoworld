import { describe,it,expect } from 'vitest';
import { approvedMemories,canReadMemory,submissionStatus,fileKey,gardenCircleKey } from './model';
describe('souvenirs privés et validation',()=>{
 it('un souvenir proposé ne rejoint le jardin qu’après validation',()=>{
  const base={id:'one',zone:'photo',type:'photo' as const,createdAt:1};
  expect(approvedMemories([{...base,status:'pending'},{...base,id:'two',status:'approved'},{...base,id:'three',status:'rejected'}]).map(m=>m.id)).toEqual(['two']);
 });
 it('une contribution de proche reste en attente',()=>{expect(submissionStatus(false)).toBe('pending');expect(submissionStatus(true)).toBe('approved');});
 it('les autres proches ne lisent pas une contribution en attente',()=>{expect(canReadMemory(false,false,true,'pending',true)).toBe(false);});
 it('un souvenir privé n’est pas lisible par le cercle',()=>{expect(canReadMemory(false,false,true,'approved',false)).toBe(false);expect(canReadMemory(false,false,true,'approved',true)).toBe(true);});
 it('propriétaire et auteur peuvent revoir les propositions masquées',()=>{expect(canReadMemory(true,false,false,'rejected',false)).toBe(true);expect(canReadMemory(false,true,true,'pending',true)).toBe(true);});
 it('le fichier appartient au cercle et au souvenir, pas à un chemin public',()=>{expect(fileKey('circle','memory','../photo.jpg')).toBe('circle/memory/.._photo.jpg');});
 it('chaque parcelle garde son propre cercle sans importer un lien global',()=>{expect(gardenCircleKey('anne')).toBe('legato.garden-circle.v1::anne');expect(gardenCircleKey('paul')).toBe('legato.garden-circle.v1::paul');expect(gardenCircleKey('anne')).not.toBe(gardenCircleKey('paul'));});
});
