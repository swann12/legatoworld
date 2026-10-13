export const CEREMONY_OBJECTS = [
  { id: "cercueil-clair", category: "Cercueil", title: "Bois clair, lignes simples", price: "800 à 1 200 €", min: 800, max: 1200 },
  { id: "cercueil-noble", category: "Cercueil", title: "Bois noble, finitions soignées", price: "1 500 à 3 000 €", min: 1500, max: 3000 },
  { id: "urne", category: "Urne", title: "Urne en céramique ou biodégradable", price: "150 à 400 €", min: 150, max: 400 },
  { id: "plaque", category: "Plaque", title: "Plaque en granit ou lave émaillée", price: "200 à 600 €", min: 200, max: 600 },
];

export function toggleCeremonyObject(selected: string[], title: string): string[] {
  return selected.includes(title) ? selected.filter(value => value !== title) : [...selected, title];
}