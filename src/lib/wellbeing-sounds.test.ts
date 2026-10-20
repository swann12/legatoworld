import {test,expect} from 'bun:test';
import {TIMER_OPTIONS,FADE_SECONDS,endingGain,DEFAULT_MIX,findSound} from './wellbeing-sounds';
test('minuteur 15, 30, 45, une heure ou toute la nuit',()=>expect(TIMER_OPTIONS).toEqual([15,30,45,60,0]));
test('baisse sur les deux dernières minutes',()=>{expect(FADE_SECONDS).toBe(120);expect(endingGain(1680,1800,true)).toBe(1);expect(endingGain(1740,1800,true)).toBe(.5);expect(endingGain(1800,1800,true)).toBe(0);});
test('toute la nuit sans fin ni baisse imposée',()=>expect(endingGain(72000,0,true)).toBe(1));
test('niveaux indépendants de la maquette',()=>expect(DEFAULT_MIX).toEqual({rain:70,sea:30,piano:15,fire:0}));
test('durées des quatre voix',()=>expect(['breath','anxiety','body','sleep'].map(id=>findSound(id)?.minutes)).toEqual([3,5,10,15]));
