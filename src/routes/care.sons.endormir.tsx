import {createFileRoute} from '@tanstack/react-router';
import {SleepSounds} from '@/components/legato/WellbeingSounds';
import {legatoHead} from '@/lib/legato-head';
export const Route=createFileRoute('/care/sons/endormir')({head:()=>legatoHead('Sons pour s’endormir','Pluie, mer, forêt et bruit blanc avec arrêt progressif.'),component:SleepSounds});
