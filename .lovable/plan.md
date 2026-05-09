## Refonte Jardin / Souvenirs / Composition

Périmètre large mais cohérent. Je propose de découper en 5 chantiers, livrés dans cet ordre. Aucune logique métier hors store n'est touchée — uniquement présentation, parcours et outil de composition.

---

### Chantier 1 — Vue du jardin (immersion)

Fichier : `src/routes/garden.index.tsx`, `src/styles.css`

- Suppression du cadre carré rigide : l'image du jardin se fond via masque radial doux (mask-image radial-gradient) dans le fond `--paper`, plus de bord net.
- Palette rafraîchie : ajout de tokens `--bloom-fresh`, `--bloom-mist`, voile bleuté très léger en surimpression pour casser l'effet sépia/vieillot.
- Hover des parcelles : remplace le halo unique par un éclaircissement local + très légère désaturation des autres parcelles (filter brightness/contrast sur les hotspots inactifs).
- Distinction subtile des parcelles : 5 zones organiques (clip-path SVG souples) avec teintes `mix-blend-soft-light` propres à chaque être, visibles seulement au repos très discret.
- Parcelles évolutives : densité visuelle (opacité du voile floral) calculée à partir de `getMemoriesForZone(zone).length` — plus de souvenirs = parcelle plus vivante.

### Chantier 2 — Entrée dans le jardin d'une personne

Fichier : `src/routes/garden.$zone.tsx`

- Suppression de la "bulle prénom" : remplacée par une petite **signature organique** SVG composée de 3–5 éléments d'atlas (issus de `elements.ts`) regroupés selon la famille dominante de la personne (`BEINGS[i].blooms`).
- Cette signature s'anime en oscillation très lente (keyframes `breathe`, 8s, ±2px/±1deg).
- Titre H1 sous la signature, marges respirées, plus aucun encadré.

### Chantier 3 — Parcours souvenir simplifié

Fichiers : `src/routes/garden.$zone.tsx` (point d'entrée souvenir), nouveau flux `src/routes/memory.new.$zone.tsx` (ou refonte existant)

Étapes claires :
1. Choix du type (voice / sentence / photo / texte / sound) — grille douce, une carte par type.
2. Capture / import du contenu (selon le type).
3. Question unique : « Souhaitez-vous composer un jardin autour de ce souvenir ? » — deux boutons doux : *Oui, composer* / *Non, simplement garder*.
4. Si non → `addMemory()` puis retour au jardin de la personne.
5. Si oui → ouverture de l'éditeur de composition pré-rempli avec ce memory id.

Refonte complète de la page « composer un jardin » : marges centrées, hiérarchie eyebrow / titre / sous-titre / paire de CTA, alignement vertical, breathing room.

### Chantier 4 — Éditeur de composition (refonte UX)

Fichier : `src/routes/compose.$zone.tsx`

Principe : **un geste, pas un logiciel**. Réduire drastiquement les outils visibles.

UI :
- Toile plein écran (calc 100vh - header), zoom auto pour qu'elle soit toujours **entièrement visible** sans scroll.
- Plus de panneau "calques" complexe : remplacé par une simple barre du bas — *éléments* (tiroir d'atlas) · *gomme douce* · *annuler / refaire*.
- Trois boutons clairs en haut : **Fermer** (croix, sortie sans enregistrer, avec confirmation si modifs), **Annuler** (revenir à l'état précédent), **Enregistrer** (validation, retour au souvenir).
- Tiroir des éléments groupé par atlas (florale, hybride, littoral, minéral, atmosphère, faune) — vignettes tactiles.

Interaction sur un élément posé :
- Tap → sélection (halo doux autour).
- Drag → déplacer.
- Pinch / molette → redimensionner.
- Rotation à deux doigts (ou poignée discrète unique en haut quand sélectionné).
- **Plus de répétition automatique** : un élément posé = un élément.
- Hold long sur un élément sélectionné → menu contextuel minimal (supprimer, dupliquer, mettre devant/derrière).

Visuel des éléments :
- Application d'un masque de bord progressif (feathering) via canvas pré-traitement à l'import : alpha érodé puis flouté de 2–3 px → contours doux, fusion naturelle.
- Mix-blend `multiply` léger en option par défaut désactivé.

### Chantier 5 — Export, retour, jardin évolutif

Export :
- Toujours rendu sur **fond blanc opaque** (pas de transparence dans le PNG final).
- Taille HD conservée (2400×3200), fidélité 1:1 avec la composition vue à l'écran.
- Bouton unique « Exporter » dans les options du souvenir, plus de confusion entre export PNG / ZIP / calques (versions avancées rangées dans un sous-menu replié).

Retrouver une composition :
- Sur la fiche du souvenir (`garden.$zone.tsx` détail) : si `composition` présente, miniature cliquable « Voir la composition » → ouvre l'éditeur en lecture/édition.
- Dans la **bibliothèque des souvenirs** (`memories.tsx`) : badge discret "composition" sur les cartes concernées, clic pour ouvrir.
- Sur le jardin de la personne : les compositions enrichissent visuellement la parcelle (voir Chantier 1, densité).

Animations globales :
- `@keyframes breathe`, `@keyframes drift`, `@keyframes shimmer` ajoutés à `styles.css`, durées 6–12s, amplitudes minimales.
- Appliquées aux signatures organiques, halos de hover, et éléments du jardin évolutif.

---

### Détails techniques

- Aucun changement de schéma data : on réutilise `Memory.composition: CompositionItem[]` existant.
- Le feathering des contours est appliqué **au moment du rendu** dans l'éditeur (canvas offscreen + filter blur sur le canal alpha), pas en pré-process des fichiers PNG sources, donc réversible.
- Aucun ajout de dépendance npm.
- Le store `legato-state` n'est pas modifié.
- Les anciens panneaux (calques drag&drop, replace, etc.) ne sont pas supprimés du fichier mais désactivés/cachés derrière un mode "avancé" replié, pour ne pas casser les compositions existantes.

### Ordre d'exécution

1. Tokens + animations dans `styles.css`
2. Garden vue de haut (Chantier 1)
3. Jardin de la personne + signature (Chantier 2)
4. Parcours souvenir (Chantier 3)
5. Éditeur refondu (Chantier 4)
6. Export + retours + densité évolutive (Chantier 5)
7. Passe française finale sur tout le périmètre

Dis-moi si je peux commencer, ou si tu veux ajuster un chantier avant.