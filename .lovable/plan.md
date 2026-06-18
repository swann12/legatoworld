# Refonte UX & parcours Legato — plan complet

Cahier des charges intégral traduit en architecture, écrans, états, contenus et règles. L'animation d'intro et la page logo Legato (`/`, `/no-words`, `/start`) ne sont pas touchées.

---

## 0. Principe directeur (non négociable)

Trois espaces strictement séparés. Jamais de mélange dans une même liste.

1. **Soutien émotionnel** — émotions, journal, respiration, sommeil, méditations, ressources sensibles, communauté, thérapeutes, IA de soutien.
2. **Démarches concrètes** — tâches, documents, obsèques, cérémonie, fleurs, textes, professionnels, courriers, succession, comptes numériques, coffre.
3. **Mémoire** — jardin, parcelles, photos, voix, lettres, objets, dates, rituels.

L'accueil ne montre **qu'une priorité à la fois**. Le contenu affiché dépend de : *situation* (onboarding) × *besoin principal* × *émotion du moment* × *heure* × *dates sensibles*.

---

## 1. Modèle de données global (state + persistance localStorage)

Fichier : `src/lib/legato-state.tsx` — étendre le store existant.

```ts
type Situation =
  | "perdu" | "peur" | "accompagner" | "soutenir"
  | "questionnement" | "volontes" | "demarches" | "soutien";

type Relation = "parent"|"conjoint"|"enfant"|"ami"|"animal"|"autre";
type Timeframe = "today"|"thisWeek"|"thisMonth"|"months"|"overYear";
type Stage = "recent"|"obseques_a_organiser"|"obseques_passees"|"demarches"|"apres";
type PrimaryNeed = "emotional"|"practical"|"both";

type Emotion =
  | "tristesse"|"colere"|"peur"|"anxiete"|"sideration"
  | "culpabilite"|"solitude"|"fatigue"|"confusion"
  | "nostalgie"|"soulagement"|"vide"|"calme"|"aide";

interface LegatoState {
  name: string;
  situation?: Situation;
  lovedOneName?: string;        // « Marie », « papa »…
  lovedOneRelation?: Relation;
  timeframe?: Timeframe;
  stage?: Stage;
  primaryNeed?: PrimaryNeed;
  currentEmotions: Emotion[];
  currentEmotionAt?: string;    // ISO; expire après 4 h → re-check-in proposé
  softDay: boolean;             // « Aujourd'hui c'est dur »
  softDayAt?: string;           // reset à minuit
  nightModeOverride?: boolean;
  // existants : careOnboarded, practicalOnboarded
}
```

Helper `useLovedName()` retourne `lovedOneName` sinon le lien (« ton père »). Utilisé partout au lieu de « le défunt ».

---

## 2. Onboarding conditionnel

Route : `src/routes/onboarding.index.tsx` (refonte) + nouveaux écrans linéaires.

Étape 1 — prénom (existant).
Étape 2 — **« Pourquoi venez-vous sur Legato aujourd'hui ? »** → 8 cartes (1 colonne, sobres, jamais en grille bruyante) :

- J'ai perdu quelqu'un
- J'ai peur de perdre quelqu'un
- J'accompagne quelqu'un en fin de vie
- Je soutiens une personne endeuillée
- Je me questionne sur la mort
- Je veux préparer mes volontés
- Je veux surtout de l'aide pour les démarches
- Je veux surtout du soutien émotionnel

Étape 3 — questions conditionnelles :

| Situation | Questions |
|---|---|
| perdu | Lien · prénom/lien à utiliser · quand (5 choix) · où en êtes-vous (5 choix) · besoin (soutien / démarches / les deux) |
| peur | Lien · prénom |
| accompagner | Lien · prénom |
| soutenir | Prénom de la personne endeuillée (optionnel) |
| questionnement | rien (`primaryNeed = emotional`) |
| volontes | rien (`primaryNeed = practical`) |
| demarches | (`primaryNeed = practical`) |
| soutien | (`primaryNeed = emotional`) |

Étape 4 — premier check-in émotion (sauf `volontes` et `demarches`).

À la fin : redirection vers `/home` configurée selon `primaryNeed`.

---

## 3. Architecture des routes

```
/                       intro (intacte)
/no-words               (intacte)
/start                  auth (intacte)
/auth                   (intacte)
/onboarding             refonte conditionnelle
/space                  porte d'entrée (2 ou 3 espaces selon primaryNeed)
/home                   accueil conditionnel

/care                   ★ NOUVEAU — espace Soutien émotionnel (index)
/care/journal           → réutilise journal.tsx
/care/breathe           respiration courte
/care/sleep             sommeil
/care/meditations       méditations deuil
/care/sounds            sons & audio
/care/letters           écrire à son proche
/care/community         communauté segmentée
/care/therapists        annuaire pros
/care/crisis            ressources crise (3114…)

/practical              index (refonte)
/practical/today        priorités du jour
/practical/categories   12 catégories listées
/practical/vault        ★ NOUVEAU coffre de documents
/practical/ceremony     parcours guidé (existe, à enrichir)
/practical/flowers, texts, atmosphere, objects, booklet, share (existants)
/practical/pros         professionnels vérifiés
/practical/delegate     délégation au cercle

/memory                 ★ NOUVEAU — index mémoire
/memory/garden          jardin (parcelles)
/memory/garden/$zone    parcelle
/memory/timeline        ligne de vie
/memory/voices          voix
/memory/letters         lettres reçues/envoyées
/memory/dates           dates sensibles

/circle                 refonte (déjà _authenticated/circle.tsx)
/checkin                ★ NOUVEAU check-in émotionnel autonome
/soft-day               ★ NOUVEAU mode « aujourd'hui c'est dur »
/resources              refonte filtrée
```

Nouvelles routes nécessitent fichiers réels + entrées dans `routeTree.gen.ts` (auto).

---

## 4. Espace `/space` — porte d'entrée

Affiché si `primaryNeed === "both"` : 3 cartes (Soutien · Démarches · Mémoire).
Sinon redirige automatiquement vers `/home` qui pointe sur l'espace dominant. Mémoire reste accessible en lien discret.

---

## 5. Navigation basse (`BottomNav`)

Quatre onglets pilotés par `primaryNeed` :

| primaryNeed | Onglets |
|---|---|
| emotional | Aujourd'hui · Soutien · Mémoire · Cercle |
| practical | Aujourd'hui · Démarches · Documents · Cercle |
| both | Aujourd'hui · Soutien · Démarches · Cercle (Mémoire dans header) |

Bouton flottant central inchangé visuellement → **« Aujourd'hui c'est dur »** (toggle `softDay`).

---

## 6. Accueil `/home` conditionnel

Réécriture de `src/routes/home.tsx`.

**Mode `emotional`** :
- Header : LegatoMark + date.
- Hero : « Comment vous sentez-vous, {prénom} ? » → si `currentEmotionAt` < 4 h, affiche l'émotion ; sinon CTA check-in.
- Bloc 1 : **suggestion liée à l'émotion** (voir §8).
- Bloc 2 : Journal (1 prompt du jour).
- Bloc 3 : Mémoire / voix / lettre selon situation.
- Pied : lien discret « Démarches » + « Aujourd'hui c'est dur ».

**Mode `practical`** :
- Header identique.
- Hero : tâche prioritaire du jour (titre court).
- Bloc 1 : prochaine échéance datée.
- Bloc 2 : documents manquants (max 2).
- Bloc 3 : « Déléguer » + statut tâches en cours.
- Pied : lien discret « Soutien ».

**Mode `both`** :
- Deux blocs côte à côte (verticaux mobile) :
  - **Pour vous soutenir aujourd'hui** → check-in / suggestion.
  - **Pour avancer concrètement** → tâche prioritaire.
- Aucun mélange.

Mode nuit (heure 21h–6h, ou `nightModeOverride`) :
- masque tâches admin ;
- propose respiration, sommeil, journal court, voix d'un proche, contact ;
- ton plus calme (typographie italique, opacité +).

---

## 7. Check-in émotionnel `/checkin`

Sélection multiple parmi 14 émotions. Stocke `currentEmotions[]` + horodatage. Redirige vers l'accueil avec suggestion appliquée.

Helper `src/lib/emotion-routing.ts` :

```ts
emotionPlan(emotions) → {
  tone: "doux"|"sobre"|"tendre"|"alerte",
  contentLength: "court"|"moyen",
  primary: { label, to, icon },
  secondary: Array<{ label, to }>,
  hideHeavyTasks: boolean,
  showCrisis: boolean,
}
```

Mappings :
- peur/anxiete → respiration courte + ancrage + crise (showCrisis)
- solitude → cercle + communauté + témoignages
- fatigue → sommeil + action courte + report tâches (hideHeavyTasks)
- culpabilite → journal guidé + ressource + thérapeute
- nostalgie → mémoire + voix + lettre + rituel
- tristesse → journal + audio doux
- colere → écrire au proche + respiration
- sideration → posture sobre, peu de contenu, contact proche
- vide → audio + cercle
- soulagement → journal de réflexion
- calme → suggestion légère
- aide → cercle + thérapeutes + crise

Si plusieurs émotions, l'ordre de priorité = aide > peur > anxiete > culpabilite > sideration > colere > solitude > tristesse > fatigue > vide > nostalgie > confusion > soulagement > calme.

---

## 8. Parcours par situation

Fichier central `src/lib/journey-config.ts` :

```ts
journeyModules(situation, primaryNeed) → {
  home: string[],          // ordre des blocs accueil
  care: string[],          // sections visibles dans /care
  practical: string[],     // catégories visibles dans /practical
  memory: string[],        // modules mémoire
  resources: string[],     // catégories ressources filtrées
}
```

| Situation | Particularités |
|---|---|
| **perdu** | tout l'éventail selon `primaryNeed` + `stage`. Si `stage=recent` → priorité démarches d'urgence + soutien immédiat. Si `apres` → mémoire + dates sensibles. |
| **peur** | deuil anticipé : peur/anxiété en tête, respiration, journal, conversations à préparer, souvenirs à collecter *maintenant*, questions à poser, volontés à aborder, contacts. **Aucune** checklist post-décès. |
| **accompagner** | présence quotidienne, fatigue aidant, conversations, documents calmes, volontés, mémoire en construction (voix, photos, mots), ressources aidants, cercle, pro. |
| **soutenir** | « quoi dire / quoi éviter », messages prêts à envoyer, propositions d'aide concrète (repas/transport/garde/admin), écouter sans forcer, dates sensibles à suivre, demande d'ajout au cercle. |
| **questionnement** | journal de réflexion, textes/lectures/podcasts, rituels symboliques, peur de mourir, rapport au temps, ce qui compte, conversations proches, volontés (si choisi). Pas de checklist. |
| **volontes** | souhaits cérémonie, personnes à prévenir, messages à transmettre, objets, documents, directives médicales, inhumation/crémation, textes/musiques/fleurs, coffre, personnes de confiance. |
| **demarches** | accès direct à `/practical`, soutien discret. |
| **soutien** | accès direct à `/care`, démarches en lien pied. |

---

## 9. Espace `/care` — Soutien émotionnel

Index = liste verticale des sections autorisées par la situation. Chaque section :

- **Check-in** — répété quand `currentEmotionAt` > 4 h.
- **Journal** — libre + prompts contextuels (émotion × moment du deuil × situation). Mode « écrire à mon proche ».
- **Respiration courte** — 1 min, 3 min, 5 min ; auto-lance si émotion peur/anxiété.
- **Sommeil** — sons naturels, voix calme, exercice 4-7-8.
- **Méditations deuil** — séries courtes (3–8 min).
- **Audios éditoriaux** — textes, témoignages, poèmes.
- **Ressources** — filtrées (voir §13).
- **Communauté** — segmentée (voir §11).
- **Thérapeutes** — annuaire pro vérifié (placeholder data).
- **Crise** — toujours accessible : 3114, associations, message « l'IA ne remplace pas un thérapeute ».

Aucune tâche administrative ici. Aucun mélange.

---

## 10. Espace `/practical` — Démarches concrètes

Refonte `practical.index.tsx`.

**Catégories (12)** : premières démarches · obsèques · cérémonie · fleurs & hommage · documents · courriers admin · succession · finances · aides & droits · comptes numériques · logement & biens · professionnels.

**Filtres temporels** : aujourd'hui · cette semaine · ce mois-ci · plus tard.
**Statuts** : à faire · en cours · fait · délégué · bloqué · document manquant · reporté · non urgent.

**Page tâche** (`/parcours/$taskId` — refondue) :
- Titre + 1 phrase « pourquoi ».
- Quand : échéance + délai légal.
- Documents requis (lien vers coffre, indique manquants).
- Modèle de courrier / message (générable par IA).
- Aide IA contextuelle.
- Professionnel utile (lien annuaire).
- Actions : marquer fait · déléguer (cercle) · reporter · signaler bloqué.

**Contenus pratiques (FR)** : déclaration de décès, mairie, CPAM, CAF, impôts, banques, mutuelles, assurances, retraite, employeur, bailleur, pompes funèbres, devis, inhumation/crémation, faire-part, textes, musiques, livret, notaire, succession, comptes numériques, abonnements, logement, objets.

Données seed dans `src/lib/practical-store.ts` (existant à enrichir).

---

## 11. Cérémonie

Parcours guidé `practical/ceremony` (existe, à enrichir) :
IA aide à : hommage · musique · fleurs · bouquet/couronne · rituel · déroulé · faire-part · livret · invitation.

Suggestions paramétrées par : lien, personnalité, saison, budget, type de cérémonie, culture/religion, énergie du moment.

---

## 12. Coffre de documents `/practical/vault`

Catégories : identité · acte de décès · finances · assurances · santé · logement · succession · volontés · contrats · autres.

Fonctions : ajouter (upload), scanner (caméra mobile), classer, partager avec un membre du cercle autorisé, voir les manquants par démarche en cours, retrouver pendant une tâche.

Persistance : Supabase Storage bucket privé `documents` (créer en passe ultérieure si non urgent — pour cette passe, UI + state local + placeholders).

---

## 13. Mémoire & Jardin `/memory`

Index : Jardin · Timeline · Voix · Lettres · Dates sensibles.

**Jardin** : une parcelle par personne/animal. Dépôts possibles : souvenir, photo, note, voix, musique, citation, bouquet, couronne, offrande symbolique, rituel.

**Dates sensibles** : anniversaire, date du décès, fête des mères/pères, Noël, première année, dates personnelles. Helper `src/lib/sensitive-dates.ts` calcule la fenêtre 2-3 jours avant ; badge visible sur l'accueil + notification douce (lettre, voix, rituel, contact).

---

## 14. Cercle `/circle`

Refonte de `src/routes/_authenticated/circle.tsx`. Deux fonctions :

1. **Soutien humain** : famille, ami·es, référent·e, thérapeute, pro, groupe, communauté.
2. **Délégation concrète** : demandes typées (repas, transport, démarches, appels, garde d'enfant, présence, aide émotionnelle, aide admin).

Actions : ajouter un proche · désigner référent·e · créer espace famille · demander de l'aide · déléguer une tâche · partager un document · partager un souvenir · contacter un thérapeute · rejoindre un groupe.

---

## 15. Communauté `/care/community`

Segments visibles : conjoint·e · parent · enfant · périnatal · animal · suicide · mort soudaine · aidants · peur de perdre. Pas de forum générique.

Modes : lire sans parler · publier · répondre.

Mention claire **modération humaine** (placeholder ; pas d'illusion d'IA seule).

---

## 16. Modes contextuels

**« Aujourd'hui c'est dur »** (bouton central BottomNav, accessible partout) :
- Toggle `softDay = true` jusqu'à minuit.
- Effets globaux : masque tâches non urgentes, propose respiration/sommeil/journal/contact, possibilité de reporter, ton plus doux (espacements +, italique tendre).
- Affiche un bandeau discret « Mode doux activé jusqu'à demain ».

**Mode nuit** :
- Auto entre 21h et 6h (sauf override).
- Pas de contenu admin lourd.
- Accès direct à respiration · sommeil · journal · voix · proche.

---

## 17. Ressources `/resources`

Refonte. Plus de blog en vrac. Filtres combinés : situation × type de perte × émotion × stage × heure × dates sensibles.

Catégories : comprendre le deuil · peur de perdre · deuil anticipé · questionnement existentiel · émotions · sommeil · respiration · rituels · textes · podcasts · livres · films · périnatal · animal · aider un proche · démarches FR · cérémonie · fleurs · coûts · courriers · succession · comptes numériques.

---

## 18. Sécurité & confiance

- Accès **crise** (`/care/crisis`) depuis : BottomNav (long press « soft day »), pied de pages soutien, mode nuit.
- 3114, associations listées, lien clic-pour-appeler.
- Bandeau récurrent « L'IA ne remplace pas un thérapeute » sur tout écran IA.
- Confidentialité : page courte « Vos données restent vôtres » accessible depuis profil.
- Pas de pub, pas de revente.

---

## 19. IA — règles de ton

- Ne se présente jamais comme thérapeute.
- Réponses courtes en mode `softDay`, mode nuit, ou émotion `fatigue/sideration`.
- Toujours proposer une issue humaine (cercle, thérapeute, crise) après 2 échanges sur sujet sensible.
- Utilise systématiquement `useLovedName()`.

---

## 20. Substitution du prénom du proche

Audit complet (recherche `défunt`, `la personne`, hardcoded names) → remplacement par `useLovedName()` dans toutes les pages :
- présence, journal, memories, garden, parcours, ceremony, texts, booklet, share, dates, wishes, community.

---

## 21. Refactor des écrans existants à toucher

| Fichier | Action |
|---|---|
| `legato-state.tsx` | étendre state + helpers |
| `onboarding.index.tsx` | refonte 4 étapes |
| `space.tsx` | porte d'entrée conditionnelle |
| `home.tsx` | accueil triple mode |
| `BottomNav.tsx` | onglets pilotés par `primaryNeed`, bouton soft-day |
| `practical.index.tsx` | catégories + temporalité + statuts |
| `parcours.$taskId.tsx` | page tâche enrichie |
| `journal.tsx` | prompts contextuels |
| `presence.tsx` | check-in émotion + suggestion |
| `community.tsx` | segments + modes lecture |
| `_authenticated/circle.tsx` | délégation typée |
| `resources.index.tsx` + `$category.tsx` | filtres contextuels |
| `crisis.tsx` | déplacé sous `/care/crisis`, contenu enrichi |
| `garden.index.tsx` + `$zone.tsx` | parcelles enrichies (offrandes/rituels) |
| `dates.tsx` | fenêtre 2-3j + suggestions |

Nouveaux fichiers :
- `src/routes/care.tsx` + `care.index.tsx` + sous-routes
- `src/routes/memory.tsx` + `memory.index.tsx` + sous-routes
- `src/routes/checkin.tsx`
- `src/routes/practical.vault.tsx`
- `src/lib/journey-config.ts`
- `src/lib/emotion-routing.ts`
- `src/lib/sensitive-dates.ts`
- `src/lib/loved-name.ts` (`useLovedName`)
- `src/lib/letter-templates.ts` (modèles de courrier)
- `src/lib/pros-data.ts` (annuaire thérapeutes placeholder)

---

## 22. Hors scope de cette passe

- Pas de migration Supabase nouvelle (coffre = UI + state local pour l'instant) — passe ultérieure pour bucket privé `documents`, table `support_requests`, table `loved_ones`.
- Pas de redesign : on conserve le système éditorial (Newsreader, ivory cards, mono-labels, terracotta).
- Animation d'intro + page logo + auth `/start` → **intactes**.
- Génération réelle de modèles IA : on branche `practical-ai.functions.ts` existant.

---

## 23. Critères d'acceptation

1. Choisir « peur de perdre quelqu'un » → l'app n'affiche **jamais** de checklist post-décès.
2. Choisir « démarches » → l'accueil ne montre **ni** journal, **ni** méditation, **ni** souvenirs en bloc principal.
3. Choisir « les deux » → deux blocs distincts à l'accueil, jamais fusionnés.
4. Sélectionner émotion *fatigue* → tâches non urgentes masquées, suggestions courtes, sommeil proposé.
5. Activer « Aujourd'hui c'est dur » → admin masqué, respiration/contact en avant jusqu'au lendemain.
6. À J-3 de la date du décès → bandeau doux sur accueil (lettre/voix/rituel).
7. Partout où l'app parle du proche → `useLovedName()` (jamais « le défunt »).
8. Aucune page ne mélange une démarche admin et une méditation dans la même liste.
9. `/care/crisis` accessible en ≤ 2 taps depuis n'importe quel écran.
10. Mode nuit auto entre 21h et 6h, contenu allégé.

Le résultat : Legato comprend la situation, sépare clairement les espaces, adapte tout à l'émotion, propose la bonne aide au bon moment sans noyer l'utilisateur.
