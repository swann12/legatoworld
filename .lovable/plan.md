ND'avant tout : l'animation d'ouverture (`/`) et la page logo restent intactes. Cette refonte couvre l'onboarding, la navigation, et toutes les pages d'app.

## 1. Design system (src/styles.css + __root.tsx)

Palette stricte (uniquement ces 6 + paper) :
- paper #FAF5EE (fond) / ink #1A1410 (texte)
- tomato #EB5E3A (action, urgence)
- butter #F2EDBD (mise en avant douce)
- sardine #7CA2E0 (information, calme)
- oven #6C2C25 (ancrage, sérieux)
- olive #8A8E3A (souvenir, vivant)
- blush #F7C7C5 (tendresse, cercle)

Typo : 2 familles seulement.
- Instrument Serif (titres éditoriaux uniquement)
- Inter (texte, boutons, labels, micro-labels en uppercase tracking-wide)
- Suppression de JetBrains Mono.

5 tailles fixes : display 40px / title 24px / body 15px / meta 13px / micro 11px uppercase.

Composants utilitaires CSS : `.eyebrow`, `.display`, `.h-section`, `.btn-primary` (tomato), `.btn-ghost`, `.card`, `.card-tint-{color}`, `.status-chip-{state}`.

## 2. Onboarding (remplace onboarding.care + onboarding.practical)

Nouveau flow unique `src/routes/onboarding.index.tsx` :
1. Prénom (existant)
2. Situation : perdu / vais peut-être perdre / soutiens / prépare volontés
3. Lien : parent / conjoint·e / enfant / ami·e / animal / autre
4. Choix d'espace : Accompagnement émotionnel **ou** Aide concrète (présenté comme deux entrées claires, pas comme un mode)
5. Si émotionnel → check-in émotions (multi-sélect jusqu'à 3, pilule colorée)

Suppression des "modes" redondants (legato-state : `mode` devient l'espace actif, plus le ressenti).

## 3. Navigation (BottomNav)

5 entrées exactement : **Accueil · Ressentir · Démarches · Cercle · Ressources**
Style : labels sans pictos lourds, indicateur tomato sous l'actif, fond paper/blur.

## 4. Pages refondues

| Route | Refonte |
|---|---|
| `home.tsx` | Tableau de bord : 1 phrase éditoriale, 1 action prioritaire auto (carte tomato), tuile humeur, tuile démarches (progression x/y), accès rapide IA + cercle. Plus de liste. |
| `journal.tsx` (Ressentir index) | Check-in (pilules), résumé, raccourcis journal/IA/jardin/ressources émo. |
| `practical.index.tsx` | Plan d'action groupé par temporalité : Immédiat / Cette semaine / Ce mois / Plus tard. Chips de statut (à faire/en cours/fait/délégué/bloqué/doc manquant). |
| `parcours.$taskId.tsx` | Détail tâche : quoi/pourquoi/quand, docs requis, modèle message, aide IA, pro recommandé, boutons Déléguer / Marquer fait. |
| `garden.*` | Parcelle par personne/animal avec dépôts (photo, note, audio, musique, fleur, bouquet, rituel). |
| `community.tsx` (Cercle) | Inviter, groupe famille, référent, délégation, qui fait quoi, partage. |
| `resources.index.tsx` | Deux onglets stricts : Émotionnelles / Concrètes. Annuaire pro avec fiches (spé, lieu, dispo, prix, contact, RDV, sauvegarder). |
| `help.*` | Fusionné dans Ressentir (ressources émo) — routes conservées pour éviter casse. |
| `space.tsx` | Mis à jour pour cohérence palette/typo, conservé comme switch entre les 2 espaces. |

## 5. Suppression / nettoyage

- Suppression JetBrains Mono import.
- Suppression des classes `--font-mono`, `editorial-frame`, `editorial-panel` redondantes.
- Suppression illustrations décoratives non symboliques.

## Découpage technique de livraison

Vu l'ampleur, je propose de livrer en **3 vagues** dans cette session :

**Vague 1 — Fondations** : styles.css (palette+typo+utilitaires), __root.tsx (fonts), Shell.tsx (ScreenHeader recalibré), BottomNav (5 entrées).

**Vague 2 — Cœur** : home, onboarding (flow complet), space, practical.index, parcours, community, resources.index.

**Vague 3 — Détails** : journal/check-in, garden parcelle, détail tâche, fiches annuaire, documents.

Je commencerai par la Vague 1 dès validation, puis enchaînerai les 2 et 3 sans nouvelle question.

## Points à confirmer

1. OK pour supprimer JetBrains Mono partout (micro-labels en Inter uppercase) ?
2. OK pour fusionner `help` dans l'onglet Ressentir (les anciennes routes restent accessibles) ?
3. OK pour le découpage en 3 vagues dans cette session ?