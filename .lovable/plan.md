# Plan

## 1. Correctifs rapides (déterministes)

**a. Brume rose sans vidéo**
- `src/routes/no-words.tsx` : retirer `rose-mist` de `SCENE_VIDEOS` (garder uniquement l'image).

**b. Pas de mots orphelins (veuves) sur les libellés de la page Souffles**
- Remplacer les espaces avant les mots courts (≤4 lettres environ) par des `&nbsp;` (`\u00A0`) dans les titres / sous-titres / légendes des scènes : "3 minutes", "main posée", etc.
- Appliquer aussi `text-wrap: pretty` / `text-wrap: balance` sur les blocs concernés.

**c. Bouton "← Retour" cassé après "Aide concrète"**
- `src/routes/onboarding.tsx` : quand on choisit `practical`, on saute directement vers `/practical` via `navigate({ to: "/practical" })`. Mais le bouton "Retour" suivant utilise `step - 1` ou `/`, donc depuis `/practical` le bouton retour ramène à la home, pas à l'onboarding step 1.
- Audit similaire : vérifier dans `practical.index.tsx`, `home.tsx`, etc. que les boutons "Retour" / "←" pointent au bon endroit (en particulier après les shortcuts).
- Fix : sur `/practical` (et ses sous-pages), le bouton retour doit revenir à l'onboarding step Branch, pas à `/home` ou `/`.

**d. Page Start — mode Invité**
- `src/routes/start.tsx` (ou `index.tsx` selon où vit le mode Invité) : ajouter le micro-texte « Ce que vous écrivez ici ne sera pas gardé. » sous le bouton/zone Invité.

## 2. Sans Mots — séquences adaptatives + IA

État actuel : 10 scènes statiques (`SCENES` dans `no-words.tsx`), les "likes" (`isFav`) sont stockés localement mais ne nourrissent rien.

Changements :
- **Capture des likes** : persister les scènes likées dans `memories-store` ou un petit store dédié (`souffles-store`).
- **Pondération** : à chaque entrée dans Souffles, prioriser les scènes proches des likes (même ambiance audio / palette) en tête de liste, et raréfier celles "skip".
- **Adaptation à l'humeur** : utiliser `mode` de `useLegato` (cocoon / anchoring / breath / lavender) pour filtrer/réordonner la liste — chaque scène reçoit un tag d'affinité par mode.
- **Suggestions de lecture** : sous chaque scène, ajouter un petit bloc « Pour prolonger » avec 1 référence (texte court, poème, citation) choisi dans `resources-data` ou via une nouvelle server function `souffle-companion.functions.ts` qui appelle Lovable AI (google/gemini-2.5-flash) avec le contexte de la scène + mode + likes.
- **Lien IA ↔ likes** : la server function reçoit `{ likedScenes, mode, branch }` et propose la prochaine scène + une courte phrase d'accueil personnalisée.

## 3. Adaptation UI/UX et IA par branche d'onboarding

Branches existantes (`legato-state.tsx`) : `person`, `animal`, `fear`, `anxiety`, `practical`, `unknown`.

Principe : la branche choisie conditionne **(a)** les rubriques visibles dans la nav, **(b)** le vocabulaire dans les écrans, **(c)** le contexte système envoyé à l'IA.

Changements :

**a. Navigation conditionnelle (`Shell.tsx` / `BottomNav.tsx`)**
- `person` (être humain perdu) : nav complète actuelle.
- `animal` : remplacer "Volontés / Pratique" par "Souvenirs" + "Rituel". Ajuster libellés ("être aimé" → "compagnon").
- `fear` / `anxiety` (questions sur la mort, anxiété) : nav réduite — Souffles, Journal, "Mes volontés", IA confidente. Cacher "Pratique", "Ressources funéraires", "Dates", "Présence".
- `practical` : déjà géré, branche "aide concrète".
- `unknown` : nav par défaut, légèrement épurée.

**b. Vocabulaire**
- Centraliser dans `src/lib/legato-state.tsx` (ou nouveau `branch-copy.ts`) un mapping `branch → { lovedOne, lossWord, presenceWord, ... }` réutilisé dans Home, Journal, Confide, Souffles.

**c. Conditionnement IA**
- Toutes les server functions qui appellent Lovable AI (`practical-ai`, `practical-suggestions`, `inspiration`, `compose-auto`, `presence`, `rituals`, `ambiance`, futur `souffle-companion`) doivent recevoir `branch` et l'injecter dans le system prompt :
  - "Tu parles à quelqu'un qui a perdu son chien/chat. N'utilise jamais le mot 'personne'..."
  - "Tu parles à quelqu'un qui se questionne sur la mort. Ne suppose pas un deuil…"
- Ajouter un helper `buildBranchContext(branch, mode)` partagé.

## 4. Audit des boutons "Retour"

Vérifier tous les boutons "←" / "Retour" :
- `practical.tsx` et ses sous-pages
- `no-words.tsx`
- `respirer`, `lire`, `regarder`
- `journal.tsx`, `memories.tsx`, `wishes.tsx`
- corriger ceux qui pointent en dur vers `/home` au lieu d'utiliser l'historique ou la vraie page parente.

## Hors plan (non touché)
- Pas de changement de modèle IA, pas de nouvelles tables Cloud sauf si nécessaire pour persister les likes côté serveur (sinon localStorage).

## Validation
- Build, puis QA visuelle rapide des pages : onboarding → practical → retour, Souffles (Brume rose, libellés), Start (mode Invité), navigation par branche (animal, fear).

---

**Question avant de lancer** : la partie 2 et 3 sont substantielles (plusieurs heures d'édition multi-fichiers). Veux-tu que je :

- **(A)** Fasse tout d'un coup (1 → 4),
- **(B)** Commence par les correctifs rapides (1) + audit retours (4), puis on traite Sans Mots adaptatif (2) et la branche-aware UX (3) dans des passes séparées ?

L'option B est plus sûre pour vérifier chaque morceau visuellement avant d'enchaîner.
