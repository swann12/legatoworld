# Refonte Legato — proposition de direction

Objectif : passer d'une app dispersée à deux expériences strictement séparées (Accompagnement / Organisation), avec un système visuel cohérent inspiré des références (Co–Star, Empathy, Kōdō, Skog & Vann, Sardine Tin). Cette passe couvre uniquement les écrans demandés au §29 du brief. Le reste suit après validation.

---

## 1. Architecture cible

```text
Intro florale  →  Logo Legato (Entrer)  →  Prénom  →  Choix d'espace
                                                       │
                                ┌──────────────────────┴──────────────────────┐
                                ▼                                             ▼
                       ÊTRE ACCOMPAGNÉ·E                              ORGANISER & AVANCER
                       (palette douce, intime)                        (palette éditoriale, contrastée)
                                │                                             │
        ┌──────────┬────────────┼─────────────┐               ┌───────────┬───┴────────┬──────────┐
        ▼          ▼            ▼             ▼               ▼           ▼            ▼          ▼
     Accueil    Jardin       Souvenirs    Présence        Accueil    Mon parcours   Services   Dossier
        │                                    │               │           │            │
     (Journal accessible depuis Accueil)   (IA, proches,    Priorité   Fiche       Annuaire +
                                            groupes, pros)  du jour   démarche    fiches pro
                                                                          │
                                                                       Cérémonie · Atmosphère ·
                                                                       FAQ · Budget · Mes volontés
```

Règles strictes :
- Jardin / Souvenirs / Compositions florales = uniquement côté Accompagnement.
- Pompes funèbres / Notaires / Cérémonie / Démarches = uniquement côté Organisation.
- Deux annuaires séparés : « Trouver du soutien » (psy, groupes) vs « Professionnels et services » (funéraire, juridique, logistique).
- Sélecteur d'espace dans le header (chip discret), pas de bannière.

---

## 2. Design system — deux dialectes d'un même langage

Base typographique partagée (3 familles, échelle réduite) :
- **Serif éditoriale** — Instrument Serif (titres, accroches)
- **Sans-serif** — Inter Tight (corps, UI, formulaires)
- **Mono** — JetBrains Mono (eyebrows, statuts, dates, micro-labels)

Échelle unique : Display 36 · H1 28 · H2 20 · Body 15 · Caption 13 · Micro 10 (uppercase tracked).

### Palette Accompagnement (douce)
```
paper    #F7F2EA   ivoire (fond)
ink      #1A1614   noir doux (texte)
mist     #E1EAE9   bleu brume
sage     #D4D7CB   sauge
peach    #F4D7B8   pêche
bordeaux #6C2C25   accent profond (rare, citations/présence)
```

### Palette Organisation (éditoriale, contrastée)
Issue de vos références (sardine tin, oven glow, butter stick, tomato soup + neutres) :
```
paper     #F7F2EA   ivoire (fond commun)
ink       #1A1614   noir
sardine   #7CA2E0   bleu (info, dates, rendez-vous)
oven      #6C2C25   bordeaux (priorité, urgence)
butter    #F2EDBD   jaune doux (en cours, attention douce)
tomato    #EB5E3A   orange franc (action principale, échéance proche)
sage-org  #A8B27A   olive (terminé)
stone     #8C7A6E   taupe (délégué / en attente)
```

Composants Organisation : coins légèrement arrondis (8–12 px), filets fins, blocs aplats colorés ponctuels, pas de pilule omniprésente, pastilles de statut en mono.
Composants Accompagnement : coins doux (16–24 px), beaucoup d'air, séparateurs hairline, accent floral discret, pas d'icônes médita-clichés.

Header commun à toutes les pages intérieures :
`[ ʟ sigle ]   ·   Prénom   ·   date         [ espace ▾ ] [ ⋯ ]`

---

## 3. Pages à livrer dans cette première passe

### 3.1 Choix d'espace (`/space-choice`, nouvelle)
Page plein écran, fond ivoire, deux blocs verticaux pleine largeur, contraste visuel fort entre les deux univers — l'utilisateur ressent immédiatement la différence.

```text
─────────────────────────────────
ʟ                  Bonjour, Swann.
─────────────────────────────────
Comment souhaitez-vous être
accompagné·e aujourd'hui ?

┌───────────────────────────────┐
│  ÊTRE ACCOMPAGNÉ·E            │   ← aplat ivoire + serif
│  Traverser ce que je ressens. │     petit motif floral
│  Écrire, respirer, me souvenir│
│                          →    │
└───────────────────────────────┘
┌───────────────────────────────┐
│  ORGANISER & AVANCER          │   ← aplat oven (bordeaux)
│  Être guidé·e pas à pas dans  │     texte ivoire, contraste fort
│  les démarches.               │
│                          →    │
└───────────────────────────────┘

  Vous pourrez changer à tout moment.
```

### 3.2 Accueil Organisation (`/plan` refondu, remplace l'imbrication Home + Practical)
Sections, dans cet ordre :
1. Header (sigle, prénom, date, sélecteur espace, cloche notifications, accès dossier).
2. Titre serif « Avançons une étape à la fois. » + sous-texte.
3. **Bloc Priorité du jour** — bloc aplat `oven` plein largeur, mono eyebrow « À FAIRE AUJOURD'HUI · ~10 MIN », titre serif, raison courte, CTA primaire ivoire « Commencer », 4 actions secondaires en chips mono : Me l'expliquer · Trouver un pro · Déléguer · Demander à l'IA.
4. **Votre progression** — bande horizontale 5 colonnes en mono : `3 terminées · 2 en cours · 1 déléguée · 2 docs manquants · prochaine échéance 12/06`.
5. **Ce qui peut attendre** — 2 lignes hairline avec eyebrow mono + titre sans-serif + chevron.
6. **Besoin d'aide ?** — 3 raccourcis en colonne (Poser une question · Contacter un pro · Inviter un proche).

L'app calcule la priorité (pas de question à l'utilisateur) — règle simple : priorité = première tâche non terminée non déléguée d'urgence max, sinon plus proche échéance.

### 3.3 Mon parcours (`/journey`, remplace les listes éparses)
- Filtres en pastilles mono : Tout · À faire · En cours · Délégué · En attente · Terminé.
- Liste de tâches en lignes éditoriales (pas de cartes uniformes) :
  ```
  ┌─────────────────────────────────────────┐
  │ ●  À FAIRE · OBSÈQUES · 12 JUIN          │
  │    Contacter une entreprise de pompes    │
  │    funèbres                              │
  │    Documents : aucun         →           │
  └─────────────────────────────────────────┘
  ```
  Pastille couleur de statut (oven/butter/sage-org/stone) à gauche, eyebrow mono = statut + catégorie + échéance, titre sans-serif, méta documents, chevron.
- Tâche déléguée affiche aussi : à qui, depuis quand, bouton « Relancer / Reprendre ».
- Section repliée « Historique » pour les terminées.

### 3.4 Fiche démarche (`/journey/$taskId`)
Structure obligatoire du brief, en 7 sections numérotées :
```
01 — Titre serif (« Déclarer le décès auprès de la mairie »)
02 — Pourquoi  (paragraphe court)
03 — Quand     (bandeau bleu sardine avec échéance)
04 — Préparer  (liste cochable de documents, avec statut "déposé")
05 — Avancer   (grille d'actions réelles : Téléphoner · E-mail · Télécharger · Déléguer · Demander à l'IA · Ajouter RDV)
06 — Suivi     (sélecteur d'état segmenté : À faire / En cours / Délégué / En attente / Terminé)
07 — Aide      (FAQ liées · Professionnels recommandés · Rappel)
```
CTA collant en bas : action principale contextuelle (Téléphoner / Démarrer / Marquer terminé).

### 3.5 Accueil Accompagnement (`/home` refondu)
- Header identique (sigle + prénom + sélecteur espace).
- Salutation serif « Bonjour Swann. » + une seule ligne « Prenons un instant pour voir ce qui pourrait vous faire du bien aujourd'hui. »
- **Pour maintenant** — bloc unique doux (peach ou mist selon état émotionnel), eyebrow « POUR MAINTENANT », titre serif (ex. « Respirer quelques minutes »), 1 phrase, CTA « Commencer ».
- 4 raccourcis en grille 2×2 hairline : Parler à une présence · Écrire quelques mots · Entrer dans le jardin · Trouver du soutien. Pas plus.
- Filet bordeaux discret « Si aujourd'hui pèse trop ».
- La priorité est calculée à partir des émotions enregistrées (mapping état → suggestion existante, réutilisé).

### 3.6 Mon cercle (`/circle` refondu)
Quatre sections clairement séparées avec eyebrows mono :
1. **MES PROCHES** — liste avec avatar/initiale, nom, rôle, dernier échange, tâche déléguée éventuelle. Bouton « Inviter un proche ».
2. **MES RÉFÉRENTS** — personne de confiance, proche principal, professionnel référent (max 3 emplacements).
3. **GROUPES & COMMUNAUTÉS** — 2–3 cartes éditoriales.
4. **SOUTIEN IMMÉDIAT** — bande bordeaux discrète, lignes d'écoute + urgences, accès direct.

### 3.7 Composer une ambiance (`/practical/atmosphere` refondu)
Page guidée, tous les boutons réellement câblés :
- Titre serif « Composer une ambiance » + texte d'intro.
- **Décrire la base** — 6 chips actifs (Décrire la personne · Importer un souvenir · Photo · Budget · Sensibilité culturelle · Me laisser guider). Chaque chip ouvre un panneau d'édition réel (drawer) qui met à jour l'état partagé.
- CTA primaire « Me proposer une première version » → server function `compose-auto` (déjà existant) → résultat structuré.
- **Sélection proposée** — 6 catégories en accordéon : Fleurs · Textes · Musiques · Couleurs · Objets · Rituels. Pour chaque élément : actions Valider · Remplacer · Régénérer · Enregistrer · Ajouter au livret · Partager. Toutes câblées.

---

## 4. Navigation

Deux barres bottom différentes :
- **Accompagnement** : Accueil · Jardin · Souvenirs · Présence
- **Organisation** : Accueil · Parcours · Services · Dossier

Le sélecteur d'espace vit dans le header (chip mono `ESPACE · ORGANISER ▾`), pas dans la bottom bar.

---

## 5. Détails techniques

- **Tokens** : refonte de `src/styles.css` avec deux sous-palettes (`--space-emotional-*`, `--space-organize-*`) accrochées via un data-attribute sur `<Shell>` (`data-space="organize" | "emotional"`). Évite de dupliquer le composant.
- **État espace** : déjà présent dans `legato-state.tsx` (`space`). Ajouter un store `journey-store.ts` pour les tâches (statut, échéance, responsable, documents). Pour cette passe : seed local en mémoire ; persistance Cloud arrivera plus tard.
- **Calcul de priorité** : helper `pickPriorityTask(tasks)` pur, basé sur (urgence DESC, échéance ASC, non délégué d'abord).
- **Routes nouvelles ou refondues** :
  - `src/routes/space-choice.tsx` (nouvelle, après onboarding)
  - `src/routes/home.tsx` (refonte accueil émotionnel)
  - `src/routes/plan.tsx` (refonte accueil organisation — supprime le chevauchement avec `practical.index`)
  - `src/routes/journey.tsx` + `src/routes/journey.$taskId.tsx` (nouvelles)
  - `src/routes/circle.tsx` (refonte)
  - `src/routes/practical.atmosphere.tsx` (refonte, boutons fonctionnels)
- **Composants** :
  - `Shell` accepte `space?: "emotional" | "organize"` et écrit `data-space` sur la racine.
  - `BottomNav` lit `space` et bascule entre les deux jeux d'items.
  - Nouveaux composants : `SpaceChip` (sélecteur header), `PriorityBlock`, `ProgressStrip`, `TaskRow`, `StatusDot`, `TaskActionGrid`.
- **Données existantes conservées** : `compose-auto.functions`, `practical-store`, `presence.functions`, `elements-manifest.json`. On câble dessus, on ne casse rien.
- **Inchangé** : `/` (intro florale) et `/start` (logo + Entrer) restent intacts. Le sigle « ʟ » est extrait dans un petit composant `LegatoMark` pour être réutilisé en header.

---

## 6. Hors-scope de cette passe (suivra après validation)

Souvenirs, Présence détaillée, Jardin, Annuaire pro complet, Fiche pro, Dossier partagé, Budget, Cérémonie, Mes volontés, FAQ, Onboarding émotionnel refondu, Modes Cocon/Ancrage/Souffle/Relais. Ces écrans seront refaits dans la passe suivante en réutilisant le même design system.

---

Validez (ou ajustez) cette direction et je commence par : tokens + Shell/Header + Choix d'espace + Accueil Organisation, puis dans la foulée Mon parcours, Fiche démarche, Accueil émotionnel, Cercle, Atmosphère.
