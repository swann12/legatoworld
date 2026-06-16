## Ce qu'il reste à faire

Les vagues 1 à 7 ont harmonisé la majorité des pages sur le nouveau design system (Instrument Serif + Inter, palette Co-Star, classes `card-plain` / `eyebrow` / `display-xl` / `btn-primary`). Voici ce qui n'a pas encore été traité :

### 1. Pages encore en style legacy

- **`compose.$zone.tsx`** (~800 lignes) — composition florale détaillée, laissée de côté en vague 7 à cause de sa logique spécifique. Refonte typo + classes + retrait `Halos`/`ceramic`.
- **`appointments.tsx`** — encore en `font-mono` inline, bordures `border-dusk/12`, titres `font-serif text-[32px]`. À passer en `eyebrow` / `card-plain` / `display-xl`.
- **`no-words.tsx`** — séquence immersive, à auditer (peut justifier de garder son ambiance propre).
- **`practical.atmosphere.tsx`** — à vérifier (touchée en vague 4 mais à reconfirmer).
- **`help.index.tsx`, `help.tsx`, `help.corps.tsx`** — vérifier qu'ils utilisent bien le nouveau système (le wrapper `HelpShell` contient encore `Halos` + `text-[11px] uppercase tracking-[0.22em]` au lieu de `eyebrow`).

### 2. Composants legato à harmoniser

- **`HelpShell.tsx`** — utilise encore `Halos` et un eyebrow manuel ; passer à `.eyebrow`, retirer `Halos` si on suit la même règle que les routes.
- **`MiniComposer.tsx`** — classes `ceramic`, `organic-radius`, `font-serif italic`, eyebrows manuels `text-[11px] uppercase tracking-[0.18em]`. À aligner.
- **`CompositionThumb.tsx`, `OrganicShape.tsx`, `LivingPatch.tsx`, `PersonalSuggestions.tsx`, `ConfideDock.tsx`, `BloomFlower.tsx`, `ModeBackground.tsx`, `Halos.tsx`** — audit visuel/typo, retirer ce qui n'est plus utilisé.
- **`ModeSelector.tsx`** — à supprimer si plus référencé (remplacé par `space.tsx`).

### 3. Nettoyage CSS final

- Supprimer dans `src/styles.css` les classes legacy devenues mortes : `editorial-frame`, `editorial-panel`, `paper-card`, `ceramic*`, `organic-radius*`, variable `--font-mono`, `feathered-soft` si plus utilisés.
- Vérifier qu'aucune route n'importe encore JetBrains Mono via classe inline.
- Retirer les `Halos` / `OrganicShape` décoratifs restants si la direction est de les bannir.

### 4. Cohérence finale

- Passe rapide sur chaque route : eyebrow Inter uppercase, titres Instrument Serif, palette stricte, chips statut homogènes.
- Vérifier l'hydration SSR sur les pages qui dépendent de `Date.now()` / `localStorage` (journal, parcours, garden, dates).
- Mettre à jour `.lovable/plan.md` pour refléter l'état réel post-vague 7.

### Découpage proposé

- **Vague 8 — Pages restantes** : `compose.$zone`, `appointments`, `no-words`, `practical.atmosphere`, `help.*`.
- **Vague 9 — Composants legato** : `HelpShell`, `MiniComposer`, audit des autres composants, suppression `ModeSelector` si mort.
- **Vague 10 — Nettoyage final** : suppression CSS mort, audit cohérence, mise à jour du plan.

Dis-moi par quoi tu veux commencer (ou si j'enchaîne directement vague 8 → 10).
