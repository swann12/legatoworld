# Refonte cohérence UI/UX — Legato

Objectif : retirer l'hétérogénéité visuelle accumulée et redonner une logique claire à la navigation. Pas de nouvelles fonctionnalités — uniquement de la mise en cohérence.

## 1. Système typographique (règle unique, appliquée partout)

Trois rôles, trois familles. Aucune exception sur les pages internes.

- **Serif (Instrument Serif)** — uniquement le titre H1 de page (via `ScreenHeader`) et les nombres/citations éditoriales.
- **Mono (JetBrains Mono)** — uniquement les eyebrows, métadonnées, labels de section, libellés de nav. Toujours uppercase, tracking 0.2-0.28em, 9.5-10.5px.
- **Sans (Work Sans)** — tout le reste : corps, sous-titres, boutons, formulaires, cartes.

Ce qui est retiré : tout `font-serif` utilisé pour des sous-titres ou boutons, tout mono utilisé en corps de texte, toute taille serif >32px en interne. Tailles serif normalisées : H1 = 30px (32px max sur l'onboarding/présentation seulement).

## 2. Palette resserrée

Le brief actuel multiplie les pastels (sage, sky, lavender, peach, rose, blush, mist) utilisés un peu partout. On les confine à des rôles :

- **Paper + Dusk** = 95% des surfaces et du texte. Toute carte par défaut = `paper` + bordure 1px `dusk/10`.
- **Bordeaux** = une seule surface feature par page (la "prochaine étape" principale). Jamais deux.
- **Terracotta** = un seul accent par page (lien crise, CTA primaire, filet d'underline). Jamais en surface large.
- **Pastels (sage/sky/lavender/peach/rose)** = uniquement en pastille catégorielle 6×6px ou en filet 1px, pas en remplissage de carte. Une seule famille pastel par page.

Suppression des doubles bordures, des fonds clay décoratifs, et des halos colorés qui parasitent la lecture.

## 3. Logique de navigation contextuelle

Problème actuel : des écrans mènent ailleurs sans raison (un tap sur une carte ouvre parfois la même section, parfois un détail, parfois un autre espace).

Règles :

- **BottomNav** = seul point d'entrée vers les 5 sections de l'espace courant. Pas de duplication dans les cartes du Home.
- **Home** = présente seulement (a) l'étape suivante personnalisée, (b) 2-3 tuiles vers les sections principales de l'espace, (c) la porte de crise. Aucun lien vers l'autre espace ailleurs que via `SpaceSwitcher` dans `/space`.
- **Cartes cliquables** = chaque carte a une destination unique et explicite, indiquée par une chevron + un libellé d'action mono ("Ouvrir", "Continuer", "Voir"). Pas de carte muette.
- **Retour** = chaque écran de niveau 2+ a un retour explicite vers son parent (pas seulement la BottomNav).
- **Espaces** = on ne quitte pas l'espace courant sans passage par `/space`. Suppression des liens croisés psy↔concret depuis les cartes de contenu.

## 4. Fichiers concernés

Pass de cohérence (édition ciblée, pas réécriture) :

```text
src/styles.css                    -- normaliser tokens, retirer classes ad hoc
src/components/legato/Shell.tsx   -- ScreenHeader unique, tailles fixes
src/components/legato/BottomNav.tsx
src/routes/home.tsx               -- réduction à 3 blocs clairs
src/routes/space.tsx              -- seul commutateur d'espace
src/routes/garden.index.tsx
src/routes/journal.tsx
src/routes/presence.tsx
src/routes/accompany.tsx
src/routes/practical.index.tsx
src/routes/plan.tsx
src/routes/documents.tsx
src/routes/circle.tsx
src/routes/resources.index.tsx
src/routes/resources.$category.tsx
src/routes/crisis.tsx
```

Les écrans de détail (`practical.*`, `resources.$category.$providerId`, `help.*`, `no-words`, `compose.$zone`) ne reçoivent qu'un alignement typographique et un retour parent — pas de refonte structurelle.

## 5. Détails techniques

- Création d'un composant `<PageLink>` (chevron + libellé mono) utilisé par toutes les cartes cliquables, pour uniformiser l'affordance.
- `ScreenHeader` accepte un prop `back?: { to: string; label: string }` pour le retour parent standardisé.
- `Section` reste inchangé.
- Pas de migration DB, pas de nouvelles routes, pas de changement de state.

## Hors scope

- Pas d'ajout de fonctionnalité.
- Pas de retouche au flux d'onboarding (déjà fait au tour précédent).
- Pas de refonte des illustrations du jardin.
- Pas de mode sombre revisité (les tokens dark restent tels quels).
