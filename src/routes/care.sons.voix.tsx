import {createFileRoute} from '@tanstack/react-router';
import {VoiceSounds} from '@/components/legato/WellbeingSounds';
import {legatoHead} from '@/lib/legato-head';
export const Route=createFileRoute('/care/sons/voix')({head:()=>legatoHead('Se calmer avec une voix','Quatre voix guidées de démonstration pour respirer et se reposer.'),component:VoiceSounds});
