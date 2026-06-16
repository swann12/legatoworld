## État actuel

Vagues 1-3 livrées : design system (palette Co-Star + Instrument Serif/Inter), navigation 5 entrées, et refonte éditoriale des pages principales (home, onboarding, space, practical.index, parcours, parcours.$taskId, community, resources.index, journal, garden.index).

## Ce qu'il reste à faire

### A. Pages secondaires non encore refondues
Elles utilisent encore l'ancien style (font-mono, editorial-frame, classes legacy) :

1. **Sous-pages `practical.*`** — atmosphere, flowers, texts, objects, ceremony, booklet, steps, share
2. **Sous-pages `help.*`** — help.index, help.corps + sous-pages (eau, habiller, manger, nuits) → à fusionner visuellement dans l'esprit Ressentir
3. **`garden.$zone.tsx`** — détail d'une parcelle (dépôts photo/note/audio/fleur/rituel) — à refondre selon la maquette parcelle
4. **`memories.tsx`, `inspiration.tsx`, `library.$kind.tsx`** — ressources éditoriales
5. **`resources.$category.tsx`, `resources.$category.$providerId.tsx`, `resources.confirm.$providerId.tsx`** — fiches annuaire pro (spé, lieu, dispo, prix, contact, RDV, sauvegarder)
6. **`appointments.tsx`, `dates.tsx`, `wishes.tsx`** — vues secondaires démarches
7. **`presence.tsx`, `no-words.tsx`, `crisis.tsx`** — moments d'aide IA / urgence
8. **`compose.$zone.tsx`** — composition florale détaillée
9. **`onboarding.care.tsx`, `onboarding.practical.tsx`** — anciens flows à supprimer ou rediriger vers le nouvel `onboarding.index`

### B. Composants legacy à harmoniser
- `Shell.tsx` / `ScreenHeader` utilisent encore `var(--font-mono)` et `editorial-frame` → à aligner sur le nouveau système
- `ConfideDock`, `PersonalSuggestions`, `MiniComposer`, `CompositionThumb`, `OrganicShape`, `Halos`, `ModeBackground`, `LivingPatch` → audit visuel + nettoyage typo/palette
- `ModeSelector` — à supprimer si plus utilisé (remplacé par `space.tsx`)

### C. Nettoyage final
- Supprimer définitivement les classes CSS legacy non utilisées (`editorial-frame`, `editorial-panel`, `--font-mono`)
- Supprimer les illustrations décoratives non symboliques restantes
- Vérifier qu'aucune page n'importe encore JetBrains Mono via classe inline

### D. Cohérence d'ensemble
- Passe rapide sur chaque route pour vérifier : eyebrow Inter uppercase, titres Instrument Serif, palette stricte (paper/ink + 6 tons), chips statut homogènes
- Vérifier hydration SSR sur toutes les pages qui dépendent de l'heure/date/localStorage

## Découpage proposé (3 vagues)

**Vague 4 — Démarches détaillées** : toutes les sous-pages `practical.*`, `compose.$zone`, `appointments`, `dates`, `wishes`, `resources.$category*`.

**Vague 5 — Ressentir détaillé** : `help.*` (fusion Ressentir), `presence`, `no-words`, `crisis`, `memories`, `inspiration`, `library.$kind`, `garden.$zone`.

**Vague 6 — Nettoyage** : Shell/ScreenHeader, composants legato legacy, suppression CSS mort, suppression anciens onboardings, audit final cohérence.

## Question

Tu veux que j'enchaîne directement les 3 vagues, ou tu préfères prioriser une partie (par ex. l'annuaire pro `resources.$category*` et le détail parcelle `garden.$zone` qui sont les plus visibles côté utilisateur) ?
