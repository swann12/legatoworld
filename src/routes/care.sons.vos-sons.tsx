import {createFileRoute} from '@tanstack/react-router';
import {SavedSounds} from '@/components/legato/WellbeingSounds';
import {legatoHead} from '@/lib/legato-head';
export const Route=createFileRoute('/care/sons/vos-sons')({head:()=>legatoHead('Vos sons gardés','Retrouvez vos ambiances favorites et vos mélanges personnels.'),component:SavedSounds});
