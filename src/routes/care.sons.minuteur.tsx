import {createFileRoute} from '@tanstack/react-router';
import {SoundTimer} from '@/components/legato/WellbeingSounds';
import {legatoHead} from '@/lib/legato-head';
export const Route=createFileRoute('/care/sons/minuteur')({head:()=>legatoHead('Le minuteur des sons','Choisissez la durée et la baisse progressive de votre ambiance.'),component:SoundTimer});
