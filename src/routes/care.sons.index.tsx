import {createFileRoute} from '@tanstack/react-router';
import {SoundsHome} from '@/components/legato/WellbeingSounds';
import {legatoHead} from '@/lib/legato-head';
export const Route=createFileRoute('/care/sons/')({head:()=>legatoHead('Des sons pour vous apaiser','Des ambiances pour dormir, vous calmer et composer votre mélange.'),component:SoundsHome});
