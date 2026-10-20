import {createFileRoute} from '@tanstack/react-router';
import {SoundMix} from '@/components/legato/WellbeingSounds';
import {legatoHead} from '@/lib/legato-head';
export const Route=createFileRoute('/care/sons/melange')({head:()=>legatoHead('Composer votre ambiance','Réglez pluie, mer, piano doux et feu de cheminée.'),component:SoundMix});
