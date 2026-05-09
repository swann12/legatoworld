# Refonte Jardin · Composition · Souvenirs · Outils

Conserver la douceur, l'évanescence, l'organique. Rendre l'ensemble plus intuitif, propre, immersif. 16 consignes regroupées en 7 chantiers.

## 1. Vue du jardin du dessus (consignes 5, 15, 16)

`src/routes/garden.index.tsx`

- Remplacer l'image de fond par celle uploadée (`user-uploads://ChatGPT_Image_9_mai_2026...png`) → `src/assets/garden-painted-v2.jpg`. Aucun cadre, dissolution douce sur les bords.
- **Hover d'un jardin** : intensification subtile (saturation +15 %, halo lumineux, légère mise au point) ; les autres jardins se désaturent doucement. Transition 1.2 s.
- **Jardin évolutif** selon le nombre de souvenirs du being :
  - 0 souvenir → simple **lopin de terre** (ovale terreux discret)
  - 1–3 → quelques pousses florales superposées
  - 4–7 → floraison partielle
  - 8+ → halo dense, jardin pleinement vivant
  - Implémentation : composant `LivingPatch` qui pioche déterministiquement dans l'atlas selon `beingId`.
- **Animations légères** : keyframe `sway` (rotation ±0.6°, 7–9 s, délais aléatoires) sur les éléments végétaux. Apparition `bloom-in` (opacity + scale, 1.4 s).

## 2. Composition au-dessus du prénom (consigne 6)

`src/routes/garden.$zone.tsx` → refonte `OrganicSignature`

- Plus de bulle ronde. Une **petite scène horizontale** (~220×120 px) sans cadre, condensation paysagère du jardin du being.
- 6–8 éléments répartis comme un mini-paysage, contours fondus, halo doux de la couleur dominante. Animation `sway`.

## 3. Atlas — contours progressifs & découpes (consignes 2, 10)

- Nouvelle classe `.feathered-soft` dans `src/styles.css` : masque radial + micro-blur, fond aquarellé, jamais de bord net.
- Appliquée partout (jardin, composeur, mini-composer, signature).
- **Audit défensif** : masque CSS de sécurité (vignette 2 %) sur les éléments de l'atlas pour atténuer artefacts (ex : iris). Régénération réelle des PNG hors scope cette itération.

## 4. Composeur de souvenirs — refonte tactile (consignes 3, 4, 11, 13, 14)

`src/routes/compose.$zone.tsx`

- **Toile entièrement visible**, plus de scroll. Layout `grid-rows-[auto_1fr_auto]`, marges contenues.
- **Outils par élément, organiques** : nouveau composant `OrganicHandles`, petite couronne flottante autour de l'élément sélectionné :
  - nord = **rotation** (glisser circulaire)
  - est = **taille** (glisser radial)
  - sud = **opacité** (glisser vertical)
  - ouest = **miroir / symétrie** (tap = flip H, double-tap = flip V)
  - Pastilles céramiques 22 px, halo doux, micro-libellé chuchoté. Pas de poignées techniques.
- **Barre du bas alignée** : `Éléments · Annuler · Refaire · Exporter` sur une seule ligne, mêmes pastilles, même typo.
- **Export** : fond blanc fidèle, prend en compte flipX/flipY/opacity/rotation. Jamais de transparence.
- Ajout `flipX?: boolean`, `flipY?: boolean` à `CompositionItem` dans `memories-store.ts`.

## 5. Mini-composer Aides concrètes / Fleurs (consignes 8, 9)

`src/components/legato/MiniComposer.tsx`

- Mêmes outils organiques (taille, rotation, opacité, miroir) — réutilisation `OrganicHandles`. Cohérence totale avec le composeur principal.
- **Couronne — placement intelligent** :
  - Chaque élément ajouté se "plugue" automatiquement sur le cercle (rayon ~30 % du canvas).
  - Répartition angulaire régulière, recalcul doux à chaque ajout.
  - Rotation auto = tangente au cercle (la fleur regarde vers l'extérieur).
- **Bouquet** : convergence vers point bas-centre, tiges vers le haut.
- **Ambiance** : dispersion organique (peaufiner).

## 6. Souvenirs — visualiser les compositions (consigne 12)

`src/routes/garden.$zone.tsx`

- Nouveau composant `CompositionThumb` : mini-prévisualisation (~60×80 px) en haut-droite des cartes de souvenir ayant une composition.
- Au clic : overlay plein écran avec composition en grand + bouton "Modifier".

## 7. Français & cohérence micro-copy

- Relecture (jardin, composer, fleurs, étapes pratiques).
- Étapes : "1 · type" → "Le type", "2 · souvenir" → "Le souvenir", "3 · composer ?" → "La composition".
- Lowercase chuchoté pour les indications ("toucher pour ouvrir", "souvenir vivant").
- Espaces insécables avant `?` `!` `:` `;`.

## Détails techniques

- Pas de nouvelle dépendance.
- Nouveaux composants : `OrganicHandles`, `LivingPatch`, `CompositionThumb`.
- Extensions `src/styles.css` : `.feathered-soft`, keyframes `sway`, `bloom-in`, classe hover de jardin.
- Copie image uploadée → `src/assets/garden-painted-v2.jpg`.

## Hors scope

- Régénération réelle des PNG mal détourés (masque défensif appliqué à la place).
- Backend / persistance (reste en localStorage).

## QA

Vérifier visuellement : `/garden`, `/garden/elise`, `/compose/elise`, `/practical/flowers` (preset couronne). Tester export PNG fond blanc avec flip + opacité.
