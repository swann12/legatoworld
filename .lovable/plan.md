# Refonte UX Legato — Plan exhaustif

Objectif : Legato devient une app **vraiment conditionnelle et sur-mesure**. Onboarding linéaire qui filtre toute la suite. **Deux espaces strictement séparés** : Soutien psychologique (qui contient la Mémoire) et Démarches concrètes. Aucun contenu inutile affiché. L'animation d'intro et la page logo restent intactes.

---

## 0. Périmètre intouchable

- `src/routes/index.tsx` (animation + logo) — **ne pas modifier**.
- `src/routes/start.tsx` (entrée vers onboarding) — conservé tel quel.
- `src/routes/__root.tsx` — modifications uniquement si une redirection legacy l'exige.
- Tous les fichiers Supabase auto-générés.

---

## 1. État global (`src/lib/legato-state.tsx`)

Étendre l'état persisté (localStorage `legato.state.v2`) :

| Champ | Type | Notes |
|---|---|---|
| `name` | string | étape 1 |
| `situation` | `perdu \| peur \| accompagner \| soutenir \| questionnement \| volontes` | étape 2 |
| `lovedKind` | `pere \| mere \| conjoint \| enfant \| frere_soeur \| grand_parent \| ami \| collegue \| animal \| autre \| null` | étape 3 |
| `lovedOther` | string | si `autre` |
| `lovedLabel` | string | étape 4 — « Marie », « mon père », « mon chien Oslo » |
| `stage` | union dépendante de `situation` (cf. §3) | étape 5 |
| `primaryNeed` | `emotional \| practical \| both` | étape 6 — **demandée une seule fois** |
| `currentEmotions[]` | `Emotion[]` (14 valeurs cf. §3.7) | étape 7 |
| `currentEmotionAt` | ISO date | |
| `softDay` | bool | manuel |
| `nightModeOverride` | `bool \| null` | |
| `legallyInvolved` | bool | demandé seulement si `lovedKind ∈ {ami, collegue, autre}` ET besoin pratique |
| `taskStatus` | `Record<TaskId, TaskStatus>` | cf. §7 |
| `taskSnoozedUntil` | `Record<TaskId, ISO>` | |
| `dismissedTasks` | `TaskId[]` | « non concerné » persistant |
| `gardenParcels[]` | `{ id, label, kind, photo?, items[] }` | une par proche/animal |
| `sensitiveDates[]` | `{ id, label, date, kind }` | dates ajoutées par l'utilisateur |

Helpers :
- `useLovedName()` → `lovedLabel` sinon dérivé de `lovedKind` ; **stable SSR** (retourne `"ton ou ta proche"` tant que `mounted=false`).
- `isAnimal()`, `isFriend()`, `isFamilyClose()`.
- `shouldShowSuccession()` = `isFamilyClose() || legallyInvolved`.
- `softMode()` = `softDay || isNight() || hasHeavyEmotion() || nearSensitiveDate(3)`.

---

## 2. Architecture des routes (cible)

```
/                          intro animée (intouchable)
/start                     porte d'entrée (intouchable)
/onboarding                machine d'étapes 1→7 (refonte)
/home                      tableau du jour adaptatif
/care                      SOUTIEN (contient Mémoire)
  /care                    → index "Aujourd'hui du Soutien"
  /care/emotions           check-in + historique
  /care/journal            journal + lettres à mon proche
  /care/memory             souvenirs / photos / voix / lettres / phrases / objets / timeline
  /care/garden             jardin + parcelles
  /care/garden/$zone       détail parcelle
  /care/dates              dates sensibles
  /care/rituals            rituels
  /care/resources          ressources contextuelles
  /care/community          communauté segmentée
  /care/help               thérapeutes / urgence
/practical                 DÉMARCHES
  /practical               → index "Aujourd'hui pratique"
  /practical/tasks         liste filtrée par statut/bucket
  /practical/tasks/$id     détail tâche (refonte de /parcours/$taskId)
  /practical/vault         coffre documents
  /practical/ceremony      parcours cérémonie (conditionnel)
  /practical/flowers       (conditionnel)
  /practical/pros          annuaire pros
  /practical/wishes        volontés (si situation=volontes)
/_authenticated/circle     cercle (segmenté)
/profile                   profil + préférences + mode doux + confidentialité
/crisis                    accès permanent
```

**Redirections legacy** (composants vides qui `<Navigate>` vers le nouveau chemin) :
- `/memory` → `/care/memory`
- `/memories` → `/care/memory`
- `/garden` → `/care/garden`
- `/garden/$zone` → `/care/garden/$zone`
- `/dates` → `/care/dates`
- `/journal` → `/care/journal`
- `/inspiration` → `/care/resources`
- `/resources` → `/care/resources`
- `/community` → `/care/community`
- `/help` → `/care/help`
- `/parcours/$taskId` → `/practical/tasks/$id`
- `/wishes` → `/practical/wishes`
- `/appointments` → `/practical/tasks` (vue rendez-vous)

---

## 3. Onboarding (refonte de `src/routes/onboarding.index.tsx`)

Machine d'états linéaire `step: 1..7` avec sauts conditionnels. Une question par écran. **Jamais deux fois la même question.**

### 3.1 Étape 1 — Prénom utilisateur
Inchangé : champ `name`.

### 3.2 Étape 2 — Situation principale
6 choix exactement (retirer ici toute mention « surtout démarches/soutien ») :
`perdu, peur, accompagner, soutenir, questionnement, volontes`.

### 3.3 Étape 3 — Personne concernée (conditionnelle)
- `perdu | peur | accompagner` → liste `lovedKind` (10 entrées dont **animal** et **autre**). Si `autre` → champ libre `lovedOther`.
- `soutenir` → « Qui est la personne endeuillée ? » (lien optionnel + prénom).
- `questionnement | volontes` → **étape sautée**.

### 3.4 Étape 4 — Prénom/lien à utiliser
Sauf `questionnement` et `volontes`. Champ texte stocké dans `lovedLabel`. Placeholder dynamique : « Marie », « mon père », « mon chien Oslo », « mon amie Léa ».

### 3.5 Étape 5 — Stade du parcours (questions dédiées)
- `perdu` : `nouvelle | obseques_a_organiser | obseques_prevues | obseques_passees | demarches | apres | inconnu`
- `peur` : `malade | fin_de_vie_proche | inquietude | peur_recurrente | parler_difficile`
- `accompagner` : `proche | aidant | loin | coordonner | sans_reperes`
- `soutenir` : `mots | aide_concrete | comprendre | duree | rejoindre_cercle`
- `questionnement` : `peur_mourir | peur_perdre | pensee_recurrente | reflechir | parler_proches | apprendre`
- `volontes` : `ceremonie | documents | messages | medical | personnes | indecis`

### 3.6 Étape 6 — Besoin principal
Question : « De quoi avez-vous besoin en priorité maintenant ? » → `emotional | practical | both`.
**Sautée** si :
- `situation = questionnement` → forcé `emotional`
- `situation = volontes` → forcé `practical`
- `lovedKind = animal` ET stade non-administratif → forcé `emotional`

### 3.7 Étape 7 — Check-in émotionnel
**Uniquement** si `primaryNeed ∈ {emotional, both}`. Multi-sélection sur 14 émotions :
`tristesse, colere, peur, anxiete, sideration, culpabilite, solitude, fatigue, confusion, nostalgie, soulagement, vide, besoin_calme, besoin_aide`.

À la fin : `setCareOnboarded(true)` + `setPracticalOnboarded(true)` → `/home`.

---

## 4. Modules par parcours (`src/lib/journey-config.ts`)

Refonte de `journeyModules(situation, lovedKind, stage, primaryNeed, { legallyInvolved })` qui retourne `{ home, care, practical }` avec règles :

### Règles d'exclusion (filtres durs)
- `lovedKind = animal` → **aucune** catégorie humaine (mairie, CPAM, notaire, succession, banque, employeur, logement, comptes numériques) ; activer parcours animal (`vet`, `cremation_animal`, `inhumation_animal`, `souvenir_objet`, `groupe_animal`, `ressources_animal`).
- `lovedKind ∈ {ami, collegue}` ET `!legallyInvolved` → masquer `succession`, `finances`, `rights`, `housing`, `digital` ; afficher `ceremony`, `flowers`, `letters`, `pros`, et cartes `hommage`, `messages`, `cagnotte`, `aide_famille`.
- `stage ∈ {obseques_passees, demarches, apres}` → masquer `obseques`, `ceremony`, `flowers` (sauf rappel hommage symbolique dans `/care/memory`).
- `stage ∈ {nouvelle, obseques_a_organiser, obseques_prevues}` → priorité `first, obseques, ceremony, documents` ; reléguer `succession, finances` en `later`.
- `situation = volontes` → uniquement `wishes_*` (ceremony, documents, messages, medical, contacts) ; **jamais** de tâches post-décès.
- `situation = peur | accompagner | soutenir | questionnement` → `practical = []` sauf si `primaryNeed = both` et l'utilisateur active explicitement « organiser quelque chose ».

### Tâches « non concerné » et « fait »
Disparaissent de toutes les vues actives ; consultables dans `/practical/tasks?filter=archived`.

---

## 5. BottomNav (`src/components/legato/BottomNav.tsx`)

Maximum 5 entrées. Conditionnel sur `primaryNeed` :
- `emotional` : Accueil · Soutien · Cercle · Profil (+ Mode doux central)
- `practical` : Accueil · Démarches · Cercle · Profil (+ Mode doux central)
- `both`      : Accueil · Soutien · Démarches · Cercle (+ Mode doux ; Profil dans header)

**Pas** de lien Mémoire ni Documents ni Coffre dans la BottomNav. Mémoire vit dans Soutien, Documents dans Démarches, accédés par leur sous-nav respective.

Sous-navigation par espace (composant `SubNav` rendu en haut de chaque index) :
- Soutien : Aujourd'hui · Émotions · Journal · Mémoire · Ressources
- Démarches : Aujourd'hui · Tâches · Documents · Cérémonie · Pros

---

## 6. Home (`src/routes/home.tsx`)

Tableau du jour adaptatif. **Trois variantes strictement séparées** :

### 6.1 Mode `emotional`
- Bloc primaire dérivé de l'émotion via `emotionPlan()`.
- 2 cartes : Journal · Mémoire (ou Jardin si `nostalgie`).
- Carte crise si `plan.showCrisis`.
- Lien discret en pied vers Démarches (« si vous avez aussi une démarche urgente »).

### 6.2 Mode `practical`
- Tâche prioritaire du jour selon `stage + statuts + bucket=now`.
- 2 cartes : Coffre (documents manquants) · Cercle (déléguer).
- Lien discret en pied vers Soutien (« si vous avez besoin de vous poser »).

### 6.3 Mode `both`
- **Deux blocs explicitement séparés** par un titre :
  - « Pour vous soutenir aujourd'hui » → 1 bloc primaire émotion.
  - « Pour avancer concrètement » → 1 bloc primaire pratique.
- Aucune carte ne mélange les deux univers.

### 6.4 Modulations transverses
- `softMode()` actif → masque toutes les démarches non-`now`, ne propose que respiration/sommeil/journal/contact ; ton IA simplifié.
- Nuit (21h–6h) → bandeau nuit ; identique softMode.
- Date sensible J-3 détectée → bandeau dédié au-dessus avec actions (lettre, voix, rituel, bouquet, contact).

### 6.5 Correctifs hydratation (urgents — runtime errors actuels)
- `SoftBanner`, `NightBanner`, et tout texte dépendant de `softDay`/`night`/`lovedLabel` rendus **uniquement après mount** (`const [mounted, setMounted] = useState(false); useEffect(()=>setMounted(true),[])`).
- `useLovedName()` retourne valeur stable `"ton ou ta proche"` tant que `!mounted`.
- `greeting` et `Intl.DateTimeFormat` calculés post-mount uniquement.

---

## 7. Statuts de tâche (`src/lib/task-status.ts` — nouveau)

Type `TaskStatus = "todo" | "doing" | "done" | "delegated" | "blocked" | "missing_doc" | "snoozed" | "not_concerned"`.

API :
- `getStatus(id)`, `setStatus(id, status, { until? })`.
- `isHidden(id)` = `status ∈ {done, not_concerned}` ou `snoozed && now < snoozedUntil`.
- `visibleTasks(list)` filtre via `isHidden`.

Détail tâche (`/practical/tasks/$id`) :
- Quoi · Pourquoi · Quand
- Documents nécessaires (lien vers coffre)
- Modèle de courrier/message (copiable, IA peut personnaliser)
- Pro utile (lien `/practical/pros?cat=...`)
- Actions : Déléguer · Marquer fait · Bloqué · Reporter (J+1/J+7) · Non concerné

---

## 8. Espace Soutien (`/care/*`)

### 8.1 `/care` index — "Aujourd'hui du Soutien"
- État émotionnel récent (chips + bouton « Mettre à jour »).
- 1 proposition adaptée à l'émotion dominante (pas une liste).
- Accès clairs vers Émotions, Journal, Mémoire, Ressources, Cercle, Aide humaine.

### 8.2 `/care/emotions`
Check-in interactif (refonte de `/checkin`). Historique des émotions récentes (7 jours), évolution douce.

### 8.3 `/care/journal`
Journal + bouton « Écrire à `${lovedName}` » (lettre sans destinataire).

### 8.4 `/care/memory`
**Centralise toute la mémoire** :
- Sous-onglets : Souvenirs · Photos · Voix · Lettres · Phrases · Objets · Timeline · Jardin · Dates.
- Liens vers `/care/garden`, `/care/dates`.

### 8.5 `/care/garden` + `/care/garden/$zone`
- Une parcelle par proche/animal (`gardenParcels`).
- Détail parcelle : photo, note, souvenir, voix, musique, citation, bouquet/couronne/offrande symbolique, rituel.

### 8.6 `/care/dates`
- Liste des dates sensibles connues + ajout libre.
- Anticipation J-3 : propose lettre, voix, rituel, contact proche, bouquet symbolique.

### 8.7 `/care/rituals`
Catalogue de rituels (existant `rituals-catalog.ts`) filtré par situation/émotion.

### 8.8 `/care/resources`
Ressources contextualisées (situation × stage × émotion × heure × dates). Catégories : comprendre le deuil, deuil anticipé, questionnement, émotions, sommeil, respiration, rituels, textes, podcasts, livres, films, témoignages, périnatal, animal, aider un proche.

### 8.9 `/care/community`
Segments : conjoint · parent · enfant · périnatal · animal · suicide · mort soudaine · aidants · peur · questionnement.
Modes : lire sans parler · publier · répondre.
Mention claire de la modération humaine.

### 8.10 `/care/help`
Thérapeutes / psychologues / numéros d'urgence / 3114 / associations.

### 8.11 Mapping émotion → suggestions (`src/lib/emotion-routing.ts`)
À enrichir pour toutes les 14 émotions selon cahier des charges (peur/anxiété → respiration+ancrage+crise ; solitude → cercle+message+groupe ; fatigue → réduction+sommeil+report ; culpabilité → journal guidé+thérapeute ; nostalgie → photo/voix/lettre/jardin ; colère → journal libre+décharge+audio ; tristesse, sidération, confusion, soulagement, vide, besoin_calme, besoin_aide → mappings dédiés).

---

## 9. Espace Démarches (`/practical/*`)

### 9.1 `/practical` index
Filtré par `situation × lovedKind × stage × statuts`.
Buckets temporels : `now / week / month / later`.
Mode doux → seul `now` visible.
Toggle « Voir aussi : terminées / non concernées ».

### 9.2 `/practical/tasks` + `/practical/tasks/$id`
Liste maître + détail (cf. §7).

### 9.3 `/practical/vault`
Coffre. Catégories : identité · acte de décès · finances · assurances · santé · logement · succession · volontés · contrats · autres.
Fonctions : ajouter, scanner (placeholder), classer, partager avec proche autorisé, voir manquants, lier à une tâche.
**Masqué** dans la nav si parcours animal ou émotionnel pur (accessible via lien tâche).

### 9.4 `/practical/ceremony`
Parcours guidé. Affiché **uniquement** si :
- humain ET obsèques pas passées, OU
- `situation = volontes` avec stade `ceremonie`, OU
- l'utilisateur clique « créer un hommage ».
Aide IA : hommage, discours, musique, fleurs, bouquet, couronne, rituel, déroulé, faire-part, livret. Propositions modulées par lien, personnalité, saison, budget, type, culture, énergie utilisateur.

### 9.5 `/practical/pros`
Annuaire vérifié, filtre par catégorie.

### 9.6 `/practical/wishes` (si `situation = volontes`)
Sous-sections : cérémonie · documents · messages · médical · personnes à prévenir.

### 9.7 Contenus pratiques (apparaissent **seulement quand pertinents**)
déclaration de décès, mairie, certificat, CPAM, CAF, impôts, banques, mutuelles, assurances, retraite, employeur, bailleur, pompes funèbres, devis, inhumation, crémation, faire-part, textes, musiques, livret de cérémonie, notaire, succession, comptes numériques, abonnements, logement, objets personnels, aides financières.

---

## 10. Mode doux — état UX réel

Déclencheurs (`softMode()`) :
- Toggle manuel `softDay`.
- Émotions : `fatigue, anxiete, sideration, vide`.
- Nuit (21h–6h).
- Date sensible J-3.

Effets globaux (consommés par `home`, `/care`, `/practical`) :
- Masque tâches `bucket !== "now"`.
- Réduit à 1 carte primaire + 1 secondaire.
- Prop `tone: "soft"` passée aux composers IA → vocabulaire simplifié, phrases courtes.
- Pas de démarches admin sauf urgence.
- Propose respiration, sommeil, journal, contact proche, report.

---

## 11. Cercle (`/_authenticated/circle`)

Segmentation : proches · famille · amis · personne référente · thérapeute · pro · groupe · communauté.
Demandes d'aide typées : repas · transport · démarches · appels · garde d'enfant · présence · aide émotionnelle · aide admin.
Affichage adapté à `primaryNeed` :
- `emotional` → met en avant contact proche, personne de confiance, groupe, thérapeute.
- `practical` → met en avant délégation, partage de documents, tâches assignées.

---

## 12. Sécurité & confiance

- `/crisis` accessible depuis footer global + long-press du bouton ♡.
- Bandeau dans tout composant IA : « ne remplace pas un·e thérapeute ».
- Orientation 3114 sur prompts à risque (détection mots-clés suicide, désespoir).
- `/profile` : confidentialité expliquée simplement, gestion mode doux, langue, prénom, suppression données.
- Pas de pub intrusive.

---

## 13. Bugs hydratation actuels (correctifs immédiats)

Erreurs visibles : `SoftBanner` et texte `useLovedName()` divergent SSR/CSR.
- Patron `mounted` dans `home.tsx`, `practical.index.tsx`, et tout composant lisant `softDay`/`lovedLabel`/`currentEmotions` issus de localStorage.
- `useLovedName()` retourne valeur neutre stable avant mount.

---

## 14. Fichiers — création / refonte / suppression

### Créer
- `src/routes/care.index.tsx`, `care.emotions.tsx`, `care.memory.tsx`, `care.garden.tsx`, `care.garden.$zone.tsx`, `care.dates.tsx`, `care.rituals.tsx`, `care.resources.tsx`, `care.community.tsx`, `care.help.tsx`, `care.journal.tsx`
- `src/routes/practical.tasks.tsx`, `practical.tasks.$id.tsx`, `practical.pros.tsx`, `practical.wishes.tsx`
- `src/routes/profile.tsx`
- Redirections legacy (composants `<Navigate>`)
- `src/lib/task-status.ts`
- `src/lib/animal-journey.ts` (catalogue tâches/ressources animal)
- `src/lib/friend-journey.ts` (catalogue ami/collègue sans succession par défaut)
- `src/lib/wishes-journey.ts`
- `src/components/legato/SubNav.tsx`

### Refondre
- `src/lib/legato-state.tsx` — nouveaux champs, helpers, persistance v2 (migration douce de v1).
- `src/lib/journey-config.ts` — matrice complète `situation × lovedKind × stage × primaryNeed × legallyInvolved`.
- `src/lib/emotion-routing.ts` — 14 émotions.
- `src/lib/loved-name.ts` — stabilité SSR.
- `src/lib/sensitive-dates.ts` — anticipation J-3.
- `src/components/legato/BottomNav.tsx` — 5 entrées max, conditionnelle.
- `src/routes/onboarding.index.tsx` — machine 7 étapes.
- `src/routes/home.tsx` — 3 modes + correctifs hydratation + bandeau date sensible.
- `src/routes/care.tsx` — devient layout `<Outlet/>` (l'index passe dans `care.index.tsx`).
- `src/routes/practical.tsx` — layout.
- `src/routes/practical.index.tsx` — filtres durs + statuts complets + onglet archives.
- `src/routes/practical.vault.tsx` — visibilité conditionnelle.
- `src/routes/practical.ceremony.tsx` — gating strict.
- `src/routes/_authenticated/circle.tsx` — segmentation + demandes typées.

### Supprimer / remplacer par redirection
- `src/routes/memory.tsx` (devenu `care.memory`)
- Pages dupliquées si conflits.

---

## 15. Ordre d'implémentation

1. **Correctifs hydratation** (`home.tsx`, `loved-name.ts`, `legato-state.tsx`) — débloque le preview.
2. **État étendu** : `legato-state.tsx` (v2 + migration), `task-status.ts`, `emotion-routing.ts` (14 émotions), `sensitive-dates.ts`.
3. **`journey-config.ts`** refondu (matrice complète + animal/ami/volontés).
4. **Onboarding** machine 7 étapes.
5. **Architecture routes** : layouts `/care` et `/practical` + index + redirections legacy.
6. **BottomNav** + composant `SubNav`.
7. **Home** 3 modes strictement séparés + bandeau date sensible + mode doux.
8. **Soutien** : index, emotions, journal, memory, garden, dates, rituals, resources, community, help.
9. **Démarches** : index, tasks, tasks/$id, vault (conditionnel), ceremony (gating), pros, wishes.
10. **Cercle** segmenté + demandes typées.
11. **Profil** + bandeaux sécurité globaux + crisis renforcée.
12. **Nettoyage** : suppression des pages devenues redondantes, vérification qu'aucune route legacy ne fuit dans la BottomNav.

---

## 16. Critères d'acceptation

- Choix `animal` ne fait jamais apparaître mairie/CPAM/notaire/succession/banque/logement.
- Choix `ami` ne fait jamais apparaître succession par défaut.
- `obseques_passees` ne fait jamais apparaître « choisir une pompe funèbre » comme priorité.
- `volontes` ne fait jamais apparaître de démarche post-décès.
- `primaryNeed` n'est jamais demandé deux fois.
- Émotions jamais demandées dans un parcours `practical` pur (accès optionnel via lien discret).
- Mémoire jamais présente comme onglet de BottomNav.
- Home `both` montre deux blocs séparés, jamais une liste mélangée.
- Une tâche `done` ou `not_concerned` ne réapparaît pas dans les vues actives.
- Aucune erreur d'hydratation au chargement de `/home`, `/care`, `/practical`.