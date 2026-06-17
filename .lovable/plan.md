
## Objectif

Aligner toute l'app sur les références fournies : typographie serif éditoriale, palette riche, cartes colorées pleines, hiérarchie aérée, et corriger toutes les liaisons entre écrans (plus aucun rebouclage vers l'onboarding).

## 1. Système de design (fondations)

**Typographie**
- Playfair Display (400/500/600 + italic) chargée via `<link>` dans `__root.tsx` comme `--font-display`.
- Conservation de la sans actuelle (Inter / system) pour le corps et les labels.
- Nouvelles classes : `display-xxl` (h1 éditorial 44–56px), `display-xl`, `display-lg`, `eyebrow` (small caps 11px tracking 0.18em), `body-lg`, `body-meta`.

**Palette** (tokens dans `src/styles.css` via `@theme`)
```
--sardine: #7CA2E0   (bleu calme)
--butter:  #F2EDBD   (crème)
--tomato:  #EB5E3A   (orange CTA / accents)
--oven:    #6C2C25   (bordeaux profond)
--blush:   #F6D6D6   (rose tendre)
--olive:   #8A8E3A   (olive)
--paper:   #FAF7F1   (fond)
--dusk:    #1F1B17   (texte)
```
Cartes pleines réutilisables : `card-sardine`, `card-butter`, `card-tomato`, `card-oven`, `card-blush`, `card-olive` (padding 24–28, rounded-[20px], texte hiérarchisé eyebrow / titre serif / corps / cta).

**Composants partagés**
- `EditorialHeader` (eyebrow + titre serif XL).
- `PageShell` (fond paper, mobile-frame, padding cohérent).
- `BackLink` (déjà présent, restylé).

## 2. Correction des liaisons (le bug que vous décrivez)

Cause : `/space` route vers `/onboarding/care` ou `/onboarding/practical` tant que `careOnboarded` / `practicalOnboarded` sont `false`. Or ces routes redirigent vers `/onboarding` → écran prénom.

Correctif :
- Dès que le prénom est saisi dans `/onboarding`, on bascule `careOnboarded = true` ET `practicalOnboarded = true` (un seul onboarding).
- `/space` route directement vers `/home` (Soi) et `/practical` (Démarches), sans condition.
- Suppression des stubs `onboarding.care.tsx` et `onboarding.practical.tsx` (redirections inutiles).
- Revue de toutes les pages pour que les `BackLink` reviennent à un parent cohérent (pas vers `/start` ou `/onboarding` depuis une page profonde).
- BottomNav : liens vérifiés (Accueil → /home, Aujourd'hui → /home, Mon espace → /space, etc.).

## 3. Pages refondues (en une passe)

Ordre, écran par écran, avec la même grammaire visuelle :

1. `start.tsx` — titre éditorial XL ("Vous n'êtes pas seul·e"), une seule CTA card-tomato.
2. `onboarding.index.tsx` — eyebrow "Pour commencer", grand titre serif, input épuré.
3. `space.tsx` — deux grandes cartes pleines (card-sardine + card-tomato) façon "Petites actions. Grande différence."
4. `home.tsx` — "Bonjour, {prénom}" serif, sous-titre "Vous n'avez pas à porter cela seul·e", grille de cartes pastel (Présence, Journal, Sans mots, Souvenirs, Volontés, Cercle).
5. `practical.index.tsx` — "Avancer à votre rythme", liste éditoriale des grandes catégories.
6. `practical.steps / ceremony / flowers / texts / atmosphere / objects / booklet / share` — header éditorial uniforme + ShareToCircle conservé.
7. `wishes.tsx` — éditorial, cartes par section.
8. `memories.tsx` — citation type "Love leaves footprints…" en hero.
9. `journal.tsx` — page jaune butter, grand titre serif, composer minimal.
10. `crisis.tsx` — fond oven sombre, texte blush, lignes d'écoute en cartes pleines.
11. `presence.tsx`, `no-words.tsx`, `community.tsx`, `garden.index.tsx`, `inspiration.tsx`, `parcours.tsx`, `_authenticated/circle.tsx`, `resources.index.tsx`, `dates.tsx`, `appointments.tsx`, `help.*` — même grammaire (eyebrow + titre serif + cartes palette + une CTA).
12. `auth.tsx`, `invite.$token.tsx` — éditorialisés.
13. `BottomNav` — restylé sur fond paper, icônes minces, label small-caps.

## 4. Hygiène

- Audit a11y rapide (focus-visible, min-h-11, alt) sur les composants touchés.
- Aucun changement de logique métier ; uniquement présentation + routing des liens.
- Correction du runtime error d'hydratation sur `/auth` (Suspense vs main au premier rendu).

## Détails techniques

- Playfair chargée via `<link>` (préconnect + stylesheet) dans `head()` du root — pas d'`@import` URL.
- Tokens en `@theme` + classes utilitaires en `@utility` (Tailwind v4).
- Aucun changement de schéma DB, aucun nouveau serverFn.
- Fichiers supprimés : `src/routes/onboarding.care.tsx`, `src/routes/onboarding.practical.tsx`.
- `legato-state.tsx` : `setName` passe aussi `careOnboarded`/`practicalOnboarded` à true.

Volume estimé : ~25 fichiers modifiés, 2 supprimés, 0 ajout de dépendance.
