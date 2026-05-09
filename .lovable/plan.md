# Refonte UX writing, hiérarchie & différenciation des modes

Cette refonte est large. Pour rester maîtrisable et te permettre de valider visuellement entre chaque étape, je propose de la découper en **5 livraisons cohérentes**, dans cet ordre. Tu pourras m'arrêter ou ajuster à tout moment.

---

## Livraison 1 — Socle global (français + mise en page + barre du bas)

Ce qui change partout, sur toutes les pages :

- **Français** : relecture complète des titres, sous-titres, micro-textes, boutons, vides, messages d'erreur. Suppression des tournures qui sonnent traduites ("avec une personne tout près", "déposez ce souvenir", etc.). Phrases courtes, naturelles, justes.
- **Veuves typographiques** : je passe les titres et phrases longues sous `text-wrap: pretty` + `text-balance` ciblé, et je réécris à la main les cas où un mot reste seul à la ligne (ex. "voix.", "souvenir.").
- **Marges et respirations** : harmonisation des paddings de page (`px-7 pt-12 pb-14` → tokens `--page-x`, `--page-top`, `--page-bottom`), gouttières verticales entre sections (`space-y-10` au lieu de `space-y-3/4` mélangés), titres détachés du haut d'écran.
- **Barre du bas** : "Accueil" → icône maison, "Espace" → icône cercle/lune. Je ne garde de mot que sur l'élément actif (label révélé). Ça libère de la marge et de l'élégance.

## Livraison 2 — Différenciation réelle des 4 modes (Cocon, Ancrage, Souffle, Relais)

Chaque mode aura **sa propre structure d'accueil**, pas seulement une couleur :

- **Cocon** — état repli. Une seule proposition à la fois, grandes respirations blanches, "Sans mots" mis en avant en premier, journal et jardin discrets.
- **Ancrage** — état solide. Liste structurée (souvenirs, jardin, démarches), rythme plus dense, "Concret" remonte en tête.
- **Souffle** — état mouvement. Inspirations et compositions au premier plan, animations un peu plus présentes, ton plus ouvert.
- **Relais** — état accompagné. Mise en avant du partage, des proches, de "Mes volontés", ton qui inclut la deuxième personne.

Concrètement : je refactore `home.tsx` pour qu'il lise le mode et compose l'écran à partir de blocs réutilisables, avec ordre + densité + tonalité par mode.

## Livraison 3 — "Parler à la présence" + "Sans mots"

**Parler à la présence** (`presence.tsx`) :
- Mise en page recentrée, typographie plus aérée, ponctuation revue.
- Halo qui respire derrière le champ de saisie (animation lente, déjà disponible via `breath`).
- Indication temporelle douce ("quelques minutes, à votre rythme") au lieu de "quelques minutes tranquilles".
- Sensation plus précieuse : carte légèrement surélevée, fond papier plus chaud.

**Sans mots** (`no-words.tsx`) :
- Fond moins opaque (passage en `paper-card` translucide sur halo coloré).
- Cartes son/ambiance avec mise en page deux lignes propres (titre / ressenti), plus de typographie qui s'étale.
- Plus d'options : ajout de 6–8 ambiances supplémentaires (foyer, pluie tiède, souffle long, voix murmurée, cloche lointaine, vent dans les feuilles, ressac, silence dense).
- Mode guidé "respirer" : un cercle qui grandit/diminue 4-7-8, sans texte, qu'on peut lancer depuis n'importe quelle ambiance.
- **Continuité sensorielle** : quand un son/ambiance plaît, bouton discret "rester dans cette atmosphère" qui appelle l'IA (Lovable AI Gateway, déjà branché via `inspiration.functions.ts` — j'ajoute une fonction `nearbyAmbiances`) pour proposer 3 variations proches sans sortir de l'état.

## Livraison 4 — "Si aujourd'hui est trop lourd" + accompagnement IA des proches

**`crisis.tsx`** : refonte complète.
- Titre plus juste : "Si aujourd'hui pèse trop".
- Hiérarchie claire : 1) une respiration immédiate, 2) une voix humaine (numéros), 3) écrire à quelqu'un, 4) revenir doucement.
- Français revu, plus de phrases bancales, espacements généreux.
- Couleur d'arrière-plan plus enveloppante (rose poudré très pâle).

**Décrire une personne** (`inspiration.tsx` + `inspiration.functions.ts`) :
- Formulaire enrichi (lien, âge approximatif, ce qu'elle aimait, un détail concret, ce qui vous manque le plus).
- Prompt IA réécrit pour produire des suggestions **incarnées** : un objet précis, un geste précis, un lieu précis, une phrase à écrire — jamais "pensez à elle", toujours quelque chose à faire ou à toucher.
- Affichage des résultats en cartes douces, avec une suite possible ("composer un jardin à partir de ceci", "garder cette piste").

## Livraison 5 — Repositionner "Mes volontés"

**Constat** : `wishes.tsx` est aujourd'hui mêlé au reste, alors que c'est une rubrique grave et personnelle.

**Proposition** :
- Sortir "Mes volontés" du flux principal.
- L'ancrer dans **Espace** (la vue intime de l'utilisateur), accessible par une carte distincte, avec une introduction qui explique qu'on peut y déposer, à son rythme, ses souhaits pour soi-même ou pour les autres.
- Ajouter un seuil doux à l'entrée : un court texte d'accueil, et la possibilité de revenir en arrière sans rien écrire.
- Supprimer toute mention "obligatoire" dans le parcours principal.

---

## Détails techniques (pour info)

- Tokens de page ajoutés dans `src/styles.css` : `--page-x`, `--page-top`, `--page-bottom`, `--stack-lg`.
- `BottomNav.tsx` passe en mode "icône + label actif".
- Nouveau composant `src/components/legato/ModeFrame.tsx` qui compose les blocs d'accueil selon le mode.
- Nouvelles fonctions IA : `nearbyAmbiances` (no-words) et un prompt enrichi pour `describePersonForPaths` (inspiration). Toutes via Lovable AI Gateway, aucune clé à fournir.
- Pas de changement de schéma de données ni de migration. Tout reste local sauf les appels IA déjà existants.

---

## Comment je procède

Je te propose de commencer par la **Livraison 1** seule : tu vois le résultat sur l'app, tu valides ou tu corriges le ton, et on enchaîne avec la 2. Si tu préfères que j'attaque plusieurs livraisons d'un coup, dis-le moi.