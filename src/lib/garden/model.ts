import type { Memory } from '@/lib/memories-store';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type GardenMemory = Memory & { status?: ReviewStatus; shared?: boolean; filePath?: string; mine?: boolean };
export const approvedMemories = (rows: GardenMemory[]) => rows.filter(m => !m.status || m.status === 'approved');
export function canReadMemory(owner: boolean, author: boolean, member: boolean, status: ReviewStatus, shared: boolean) {
  return owner || author || (member && status === 'approved' && shared);
}
export const submissionStatus = (owner: boolean): ReviewStatus => owner ? 'approved' : 'pending';
export const fileKey = (circle: string, memory: string, name: string) => `${circle}/${memory}/${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
export const gardenCircleKey = (spaceId: string) => `legato.garden-circle.v1::${spaceId}`;
export type AddKind = 'photo' | 'voix' | 'phrase' | 'lieu' | 'objet' | 'date' | 'recette';
export const addKinds: AddKind[] = ['photo','voix','phrase','lieu','objet','date','recette'];
export function filterMemories(rows: GardenMemory[], kind: string) {
 const all = approvedMemories(rows);
 if(kind==='photo') return all.filter(m=>m.type==='photo' && m.zone!=='objet');
 if(kind==='voix') return all.filter(m=>m.type==='voice'||m.type==='sound');
 if(kind==='lettre') return all.filter(m=>m.type==='sentence'||m.zone==='lettre');
 if(kind==='lieu') return all.filter(m=>m.zone==='lieu');
 return all;
}
