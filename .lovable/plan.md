## État actuel (post-vague 10)

Vagues 1-10 livrées : design system unifié (Instrument Serif + Inter, palette Co-Star), navigation 5 entrées, harmonisation typo/classes sur la quasi-totalité des routes et composants (`card-plain`, `eyebrow`, `display-xl`, `btn-primary`). Suppression des classes `editorial-*` mortes et du composant `ModeSelector` inutilisé. `HelpShell` aligné sur le système.

## Ce qu'il reste de connu

- **`compose.$zone.tsx`** — composer floral (~800 l.), gardé sur l'esthétique `ceramic` / `organic-radius` qui sert l'outil créatif.
- **`no-words.tsx`** — séquences immersives plein écran, ambiance propre volontaire.
- **`MiniComposer.tsx`, `CompositionThumb.tsx`, `OrganicShape.tsx`, `LivingPatch.tsx`, `BloomFlower.tsx`** — outils de composition, esthétique organique conservée.
- **`paper-card`** — encore utilisée par `PersonalSuggestions`, `ConfideDock`, `compose.$zone` → conservée dans `styles.css`.

Ces éléments peuvent être retouchés au cas par cas si tu veux pousser plus loin la cohérence visuelle.
