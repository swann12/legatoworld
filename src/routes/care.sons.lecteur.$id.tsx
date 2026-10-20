import {createFileRoute} from '@tanstack/react-router';
import {SoundPlayer} from '@/components/legato/WellbeingSounds';
import {legatoHead} from '@/lib/legato-head';
import {findSound} from '@/lib/wellbeing-sounds';
export const Route=createFileRoute('/care/sons/lecteur/$id')({head:({params})=>legatoHead(findSound(params.id)?.title??'Votre ambiance sonore','Un lecteur apaisant avec minuteur et sons gardés.'),component:Player});
function Player(){const{id}=Route.useParams();return <SoundPlayer id={id}/>;}
