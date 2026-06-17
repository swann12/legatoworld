## Objectif

Refonte UI complète de Legato pour matcher les références : éditorial, calme, premium, hiérarchie typographique forte (Cormorant Garamond + Inter), couleurs bien réparties, schémas graphiques simples. L'animation d'intro et la première page logo restent intactes.

## 1. Fondations (src/styles.css + __root.tsx)

**Typo**
- Charger `Cormorant Garamond` (400/500/italic) + `Inter` (300–700) + `Space Mono` (micro-labels graphiques) via `<link>` dans `__root.tsx`.
- Remplacer Playfair par Cormorant Garamond comme `--font-display`.
- Classes standardisées :
  - `ed-display` (Cormorant 44–56px, leading 1.0, tracking -0.01em) — titres poster
  - `ed-title` (Cormorant 32–38px) — titres de page
  - `ed-section` (Cormorant 22–26px) — titres de section / cartes
  - `body` (Inter 15px, leading 1.5)
  - `body-meta` (Inter 13px, dusk/65)
  - `eyebrow` (Inter 11px, uppercase, tracking 0.18em)
  - `mono-label` (Space Mono 10–11px, uppercase, tracking 0.14em) — pour dates/statuts/numéros de section
- **Suppression** des classes non-éditoriales : `index-num`, `folio` (style № marginalia) → remplacées par `mono-label` aligné en grille.

**Palette (tokens @theme)**
- Conserve les 6 accents existants (sardine, butter, tomato, oven, blush, ochre) + paper/dusk.
- Pas de bleu foncé. Une dominante claire + un accent par écran.
- Surfaces : `surface-paper`, `surface-ivory` (carte ivoire contour fin), `surface-tomato`, `surface-butter`, `surface-sardine`, `surface-blush`, `surface-oven`, `surface-ochre`.

**Composants partagés (nouveaux ou consolidés)**
- `PageHeader` : back arrow + titre centré mono-label + … (style INSPI2/6).
- `EditorialHero` : eyebrow + grand titre serif + sous-texte (style "Bonjour Camille").
- `PosterCard` : carte pleine couleur, phrase serif XXL, métadonnées top, action bas (style "Love leaves footprints").
- `IvoryCard` : carte ivoire contour fin 1px dusk/10, rayon 18px.
- `ColorCard` : carte pleine couleur (sardine/butter/etc), padding 24, rayon 18.
- `SectionLabel` : mono-label + ligne fine horizontale.
- `RingProgress` : SVG cercle de progression (style INSPI2 "68%").
- `LinearProgress` : barre de progression (style INSPI6 Checklist).
- `MoodGauge` : demi-cercle (style "64% Charge émotionnelle").
- `SupportCircle` : SVG cercle de soutien (centre Vous + satellites colorés).
- `MoodTrend` : courbe SVG simple (style INSPI5/9).
- `EmotionGrid` : grille 3×N de chips émotions (style "Tristesse/Colère/Peur").
- `MoodChip` : badge émotion (sélectionné = tomato fond).
- `TaskRow` : checkbox + titre + meta + chevron (style INSPI6 "Plan a small gathering").
- `DocumentRow` : icône + libellé + count + chevron.
- `ResourceCard` : carte pleine couleur avec eyebrow + titre + flèche (style INSPI7 "Ressources").
- `BottomNav` : restylé : icônes minces, label Inter 10px, état actif dot tomato.

## 2. Routing & liaisons (correctifs)

- `/space` : déjà OK, sans onboarding loops.
- Vérifier que tous les `BackLink`/headers reviennent à un parent logique (Soi → /home, Démarches → /practical).
- BottomNav cohérent partout : Accueil(/home), Cercle(/_authenticated/circle), Progrès(/parcours), Ressources(/resources), Profil(/space).
- Supprimer onboarding.care/practical stubs s'ils causent encore des boucles.

## 3. Écrans à refaire (toute la passe)

Tous reçoivent : `PageHeader` mono-label OU `EditorialHero` selon contexte, marges 24px, fond paper, max 1 action principale, dominante + 1 accent.

**Espace Soi**
1. `space.tsx` — déjà refondue, ajuster pour parler le même vocabulaire (mono-label "01 / 02", IvoryCard + PosterCard tomato).
2. `home.tsx` — "Bonjour, {prénom}" + "Comment allez-vous aujourd'hui ?" en titre serif. PosterCard butter "Ce qui compte, aujourd'hui" → check-in. Sous : grille 2 IvoryCard (Check-in / Mon cercle). Aperçu cercle + petit pas recommandé.
3. `presence.tsx` — check-in 5 étapes : grande question serif, MoodChip grid, bouton tomato "Continuer", barre progression top.
4. `journal.tsx` — fond butter, titre serif "Écrire pour libérer", composer Inter.
5. `memories.tsx` — PosterCard format (style INSPI1 "Love leaves footprints"), liste cartes pastel (souvenirs).
6. `garden.index.tsx` — schéma simple parcelles (cercles colorés), légère pas décoratif.
7. `community.tsx` / `_authenticated/circle.tsx` — `SupportCircle` SVG (Vous au centre tomato, satellites par couleur), liste personnes en dessous.
8. `crisis.tsx` — fond oven, texte blush, cartes pleines pour lignes d'écoute.
9. `no-words.tsx`, `inspiration.tsx` — PosterCard.

**Espace Démarches**
10. `practical.index.tsx` — refonte : header mono-label "DÉMARCHES", titre serif "Avancer à votre rythme", `RingProgress` (% + Completed/Planned), section "Top focus" en card blush, checklist par temporalité (Today/This week/Upcoming) avec `TaskRow`, bouton noir "+ Ajouter une tâche".
11. `parcours.tsx` — vue d'ensemble : `RingProgress`, stats 3 colonnes, liste catégories.
12. `parcours.$taskId.tsx` — fiche tâche éditoriale.
13. `wishes.tsx` — `DocumentRow` par catégorie (Identité/Finances/Assurances…), fond sardine léger, bouton noir "+ Ajouter un document".
14. `appointments.tsx` — liste éditoriale rendez-vous.
15. `practical.{ceremony,flowers,texts,atmosphere,objects,booklet,share}` — `PageHeader` + grand titre serif + cartes IvoryCard ou ColorCard.
16. `resources.index.tsx` — INSPI7 "Des ressources pour vous guider" : 3 ColorCard (Comprendre / Guides pratiques / Soutien) + bouton secondaire "Voir toutes".
17. `resources.$category.tsx`, `resources.$category.$providerId.tsx`, `resources.confirm.tsx` — fiches pros propres.
18. `dates.tsx` — propre.

**Communes**
19. `start.tsx` — laissé tel quel (animation intro + logo).
20. `index.tsx` — laissé tel quel (intro).
21. `onboarding.index.tsx` — EditorialHero + input épuré (déjà ok mais accordée typo).
22. `auth.tsx`, `invite.$token.tsx` — éditorialisés.
23. `BottomNav.tsx` — restylé.

## 4. Schémas (composants graphiques)

Tous en SVG inline, sobres :
- `RingProgress` (cercle, % au centre)
- `MoodGauge` (demi-cercle)
- `MoodTrend` (line chart simple)
- `SupportCircle` (orbite + satellites)
- `LinearProgress` (barre fine)

Pas de Recharts. Pas de datavisualisation complexe.

## 5. Hygiène

- a11y : focus-visible, min-h-11 sur tappables, aria-label.
- Pas de logique métier modifiée.
- Vérifier qu'aucun runtime error ne reste après refonte.

Volume : ~25 fichiers modifiés, 5–8 nouveaux composants, 0 dépendance ajoutée.

## Détails techniques

- Cormorant Garamond + Inter + Space Mono via `<link>` dans `head()` du root.
- Tokens en `@theme` + classes `@utility` (Tailwind v4).
- SVG inline pour graphes (pas de lib).
- Aucun changement DB / serverFn.
