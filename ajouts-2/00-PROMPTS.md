# Prompts Lovable — ajouts (dossier complet)

À envoyer **après** les prompts du premier dossier (`legato-design/00-PROMPTS-LOVABLE.md`), un par un, dans l'ordre. Joins à chaque message les captures citées et les plans indiqués : ils sont dans le dossier `ajouts-2-images` sur ton ordinateur.

---

## Message B0 — Le cadre

```
Le dossier `legato-design/ajouts-2/` ajoute et modifie des écrans par rapport à ce que tu as construit avec `legato-design/`. Il remplace le dossier `legato-design/ajouts-1/`, que tu dois ignorer.
Lis :
- `legato-design/ajouts-2/01-REGLES.md` : les règles nouvelles (logo, quatre types d'espace, menus adaptés, couleurs, Démarches selon la réponse, sécurité, visiteurs, Présence, corps, rituels) ;
- `legato-design/ajouts-2/02-ECRANS.md` : les 118 écrans B001 à B118, avec leur route, ce qu'on peut toucher et le texte exact ;
- `legato-design/ajouts-2/maquettes.html` : les maquettes HTML des 118 écrans, une section par écran (B001 à B118), avec les mesures exactes ;
- `plan-menus.png`, `plan-demarches.png`, `plan-rituels.png` : les trois plans.
Je joindrai les captures de chaque écran à mes messages.
Mêmes règles de travail que pour le premier dossier : la section de `maquettes.html` donne les mesures exactes, la capture sert à vérifier, la maquette fait foi pour les fonctions, tu ne supprimes rien sans me demander, et tu gardes tout ce qui a déjà été fait (dont l'animation d'ouverture et le jardin peint avec les parcelles).
Pour cette première réponse, ne modifie aucun code : résume-moi en 12 lignes ce qui change, en particulier les quatre types d'espace, les menus, les couleurs et les règles de sécurité.
```

---

## Message B1 — Écrans du premier dossier, modifiés (captures B001, B002, B003, B004, B005, B006 + plan-menus.png)

```
Étape B1 sur B13 : Écrans du premier dossier, modifiés. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B001 · Couleurs par espace → — (modifié)
   - B002 · Aujourd'hui → /home (modifié)
   - B003 · Le soir (mode nuit) → /home après 21 h (modifié)
   - B004 · Une invitation → /invite/$token (modifié)
   - B005 · C'est prêt → /onboarding · fin (modifié)
   - B006 · Présence · conversation → /presence (modifié)

- Remplace partout le mot « Legato » de l'en-tête par le logo (§1).
- Mets en place les quatre types d'espace (§2) et la barre de navigation qui s'adapte (§3, joins `plan-menus.png`).
- Applique les couleurs du §4.
- Refais « C'est prêt » sur le modèle du §5, et Présence en conversation (§9) en gardant `presence.functions.ts`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B2 — Visiteurs : découvrir sans compte (captures B007, B008, B009, B010, B011, B012)

```
Étape B2 sur B13 : Visiteurs : découvrir sans compte. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B007 · Bienvenue avec « Découvrir sans compte » → /start (modifié)
   - B008 · Découvrir sans compte → /start/decouverte (à créer)
   - B009 · Aujourd'hui en mode découverte → /home (mode découverte) (à créer)
   - B010 · Compte nécessaire → /start/compte-requis (à créer)
   - B011 · Garder ce qui est commencé → /start/garder (à créer)
   - B012 · Créer son compte → /auth (création) (existe)

- Ajoute le mode découverte (§8) : stockage local, bandeau, compte nécessaire pour inviter ou écrire dans un groupe, reprise de tout à la création du compte.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B3 — Démarches selon la réponse « Où en êtes-vous avec les papiers ? » (captures B013, B014, B015, B016 + plan-demarches.png)

```
Étape B3 sur B13 : Démarches selon la réponse « Où en êtes-vous avec les papiers ? ». Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B013 · Démarches · avant les obsèques → /practical (réponse « rien n'est commencé ») (existe)
   - B014 · Démarches · après les obsèques → /practical (réponse « obsèques passées ») (existe)
   - B015 · Démarches · presque tout est fait → /practical (réponse « presque tout est fait ») (existe)
   - B016 · Démarches · quelqu'un s'en occupe → /practical (réponse « quelqu'un s'en occupe ») (existe)

- Applique la logique du §6 (joins `plan-demarches.png`) à l'onglet Démarches de l'espace « personne décédée ». La réponse vient de la première ouverture (onboarding.practical) et se change dans les réglages de l'espace.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B4 — Le corps (captures B017, B018, B019, B020, B021)

```
Étape B4 sur B13 : Le corps. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B017 · Le corps · sommaire → /help/corps (existe)
   - B018 · Ce que le deuil fait au corps → /help/corps/comprendre (à créer)
   - B019 · Quand consulter → /help/corps/consulter (à créer)
   - B020 · Bouger un peu → /help/corps/bouger (à créer)
   - B021 · Votre petit suivi → /help/corps/suivi (à créer)

- Refais le sommaire du corps et ajoute les pages nouvelles (§10). Les pages Dormir, Manger, Se laver, S'habiller du premier dossier restent.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B5 — Parcours « un animal qui est mort » (1/2) : première ouverture, Aujourd'hui, Soutien (captures B022, B023, B024, B025, B026, B027, B028, B029, B030, B031)

```
Étape B5 sur B13 : Parcours « un animal qui est mort » (1/2) : première ouverture, Aujourd'hui, Soutien. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B022 · Animal · 1 pour qui → /onboarding · étape 1 (existe)
   - B023 · Animal · 2 son nom → /onboarding · étape 2 (existe)
   - B024 · Animal · 3 où en êtes-vous → /onboarding/practical (existe)
   - B025 · Animal · 4 besoins → /onboarding/care (existe)
   - B026 · Animal · c'est prêt → /onboarding · fin (existe)
   - B027 · Animal · Aujourd'hui → /home (espace animal) (à créer)
   - B028 · Animal · Soutien → /care (espace animal) (à créer)
   - B029 · Animal · la culpabilité → /care/guilt (à créer)
   - B030 · Animal · en parler à un enfant → /home/parler-enfant (existe)
   - B031 · Animal · un autre animal → /care/new-animal (à créer)

- Type d'espace « animal » (§2, §3). Couleurs du deuil (§4).
- Chaque option de Démarches a sa propre page.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B6 — Parcours « un animal qui est mort » (2/2) : Démarches, Mémoire, Communauté (captures B032, B033, B034, B035, B036, B037, B038, B039, B040, B041)

```
Étape B6 sur B13 : Parcours « un animal qui est mort » (2/2) : Démarches, Mémoire, Communauté. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B032 · Animal · Démarches → /practical (espace animal) (à créer)
   - B033 · Animal · crémation ou enterrement → /practical/animal-body (à créer)
   - B034 · Animal · la crémation → /practical/animal-body/cremation (à créer)
   - B035 · Animal · l'enterrer dans son jardin → /practical/animal-body/jardin (à créer)
   - B036 · Animal · cimetière animalier → /practical/animal-body/cimetiere (à créer)
   - B037 · Animal · déclarer son décès → /practical/animal-id (à créer)
   - B038 · Animal · prévenir son assurance → /practical/animal-insurance (à créer)
   - B039 · Animal · arrêter les abonnements → /practical/animal-subscriptions (à créer)
   - B040 · Animal · Mémoire → /care/garden/space (espace animal) (à créer)
   - B041 · Animal · Communauté → /care/community (espace animal) (à créer)

- Type d'espace « animal » (§2, §3). Couleurs du deuil (§4).
- Chaque option de Démarches a sa propre page.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B7 — Parcours « un proche gravement malade » (1/2) : première ouverture, Aujourd'hui (captures B042, B043, B044, B045, B046, B047, B048, B049, B050, B051, B052, B053)

```
Étape B7 sur B13 : Parcours « un proche gravement malade » (1/2) : première ouverture, Aujourd'hui. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B042 · Proche malade · 1 pour qui → /onboarding · étape 1 (existe)
   - B043 · Proche malade · 2 son prénom → /onboarding · étape 2 (existe)
   - B044 · Proche malade · 3 où en est-elle → /onboarding/practical (existe)
   - B045 · Proche malade · 4 besoins → /onboarding/care (existe)
   - B046 · Proche malade · c'est prêt → /onboarding · fin (existe)
   - B047 · Proche malade · Aujourd'hui → /home (espace proche malade) (à créer)
   - B048 · Proche malade · questions au médecin → /home/questions-medecin (à créer)
   - B049 · Proche malade · le carnet → /home/carnet (à créer)
   - B050 · Proche malade · un rendez-vous du carnet → /home/carnet/$id (à créer)
   - B051 · Proche malade · noter ce qui a été dit → /home/carnet/note (à créer)
   - B052 · Proche malade · qui fait quoi → /home/equipe (à créer)
   - B053 · Proche malade · demander un coup de main → /home/equipe/demande (à créer)

- Type d'espace « proche gravement malade » (§2, §3) : onglets « Aides » et « Souvenirs ».
- Rose et bleu dans Aides, Souvenirs, Communauté (§4).
- Le carnet et « Qui fait quoi » se partagent avec le cercle (tables circles, circle_members).
- « Si elle est décédée » transforme l'espace en espace de deuil, en gardant le carnet, les volontés, les souvenirs et le cercle.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B8 — Parcours « un proche gravement malade » (2/2) : Soutien, Aides, Souvenirs, Communauté (captures B054, B055, B056, B057, B058, B059, B060, B061, B062, B063, B064, B065, B066, B067)

```
Étape B8 sur B13 : Parcours « un proche gravement malade » (2/2) : Soutien, Aides, Souvenirs, Communauté. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B054 · Proche malade · Soutien → /care (espace proche malade) (à créer)
   - B055 · Proche malade · l'épuisement → /care/epuisement (à créer)
   - B056 · Proche malade · Aides → /practical (espace proche malade) (à créer)
   - B057 · Proche malade · congé de proche aidant → /practical/conge-aidant (à créer)
   - B058 · Proche malade · l'allocation journalière → /practical/ajpa (à créer)
   - B059 · Proche malade · une aide à domicile → /practical/aide-domicile (à créer)
   - B060 · Proche malade · ses volontés → /practical/wishes (espace proche malade) (existe)
   - B061 · Proche malade · sa personne de confiance → /practical/wishes/confiance (à créer)
   - B062 · Proche malade · ses directives anticipées → /practical/wishes/directives (à créer)
   - B063 · Proche malade · Souvenirs → /care/garden/space (espace proche malade) (à créer)
   - B064 · Proche malade · ses histoires → /care/garden/histoires (à créer)
   - B065 · Proche malade · ses recettes → /care/garden/recettes (à créer)
   - B066 · Proche malade · Communauté → /care/community (espace proche malade) (à créer)
   - B067 · Proche malade · si elle est décédée → /space/settings/transition (à créer)

- Type d'espace « proche gravement malade » (§2, §3) : onglets « Aides » et « Souvenirs ».
- Rose et bleu dans Aides, Souvenirs, Communauté (§4).
- Le carnet et « Qui fait quoi » se partagent avec le cercle (tables circles, circle_members).
- « Si elle est décédée » transforme l'espace en espace de deuil, en gardant le carnet, les volontés, les souvenirs et le cercle.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B9 — Parcours « je pense beaucoup à la mort » (1/2) : première ouverture, Aujourd'hui, Soutien (captures B068, B069, B070, B071, B072, B073, B074, B075, B076, B077)

```
Étape B9 sur B13 : Parcours « je pense beaucoup à la mort » (1/2) : première ouverture, Aujourd'hui, Soutien. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B068 · Penser à la mort · 1 pour qui → /onboarding · étape 1 (existe)
   - B069 · Penser à la mort · 2 ce qui vous occupe → /onboarding · étape 2 (existe)
   - B070 · Penser à la mort · 3 en ce moment → /onboarding · étape 3 (existe)
   - B071 · Penser à la mort · c'est prêt → /onboarding · fin (existe)
   - B072 · Penser à la mort · Aujourd'hui → /home (espace questions sur la mort) (à créer)
   - B073 · Penser à la mort · penser à mourir ? → /home/penser-a-mourir (à créer)
   - B074 · Penser à la mort · écrire ce qui fait peur → /home/ecrire-peur (à créer)
   - B075 · Penser à la mort · Soutien → /care (espace questions) (à créer)
   - B076 · Penser à la mort · l'angoisse → /care/angoisse (à créer)
   - B077 · Penser à la mort · ce que d'autres en ont dit → /care/resources (espace questions) (à créer)

- Type d'espace « je pense beaucoup à la mort » (§2, §3) : onglets « Préparer » et « Transmettre ».
- Tout l'espace en rose et vert profond (§4).
- Règles de sécurité du §7 : prioritaires.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B10 — Parcours « je pense beaucoup à la mort » (2/2) : Préparer, Transmettre, Communauté (captures B078, B079, B080, B081, B082, B083, B084, B085, B086, B087, B088, B089, B090)

```
Étape B10 sur B13 : Parcours « je pense beaucoup à la mort » (2/2) : Préparer, Transmettre, Communauté. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B078 · Penser à la mort · Préparer → /practical (espace questions) (à créer)
   - B079 · Penser à la mort · mes souhaits pour mes obsèques → /practical/obseques (à créer)
   - B080 · Penser à la mort · ma personne de confiance → /practical/confiance (à créer)
   - B081 · Penser à la mort · mes directives anticipées → /practical/directives (à créer)
   - B082 · Penser à la mort · le don d'organes → /practical/don-organes (à créer)
   - B083 · Penser à la mort · mon testament → /practical/testament (à créer)
   - B084 · Penser à la mort · un contrat obsèques → /practical/contrat-obseques (à créer)
   - B085 · Penser à la mort · Transmettre → /care/garden/space (espace questions) (à créer)
   - B086 · Penser à la mort · raconter votre vie → /care/garden/histoire (à créer)
   - B087 · Penser à la mort · lettres pour plus tard → /care/garden/lettres (à créer)
   - B088 · Penser à la mort · vos objets → /care/garden/objets (à créer)
   - B089 · Penser à la mort · Communauté → /care/community (espace questions) (à créer)
   - B090 · Penser à la mort · café mortel → /care/community/cafe-mortel (à créer)

- Type d'espace « je pense beaucoup à la mort » (§2, §3) : onglets « Préparer » et « Transmettre ».
- Tout l'espace en rose et vert profond (§4).
- Règles de sécurité du §7 : prioritaires.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B11 — Rituels : accueil, gestes, à plusieurs (captures B091, B092, B093, B094, B095, B096, B097, B098, B099, B100, B101, B102 + plan-rituels.png)

```
Étape B11 sur B13 : Rituels : accueil, gestes, à plusieurs. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B091 · Rituels · accueil → /care/rituels (existe)
   - B092 · Rituels · un geste, maintenant → /care/rituels/maintenant (à créer)
   - B093 · Rituels · à plusieurs → /care/rituels/ensemble (à créer)
   - B094 · Rituels · ma tradition → /care/rituels/tradition (à créer)
   - B095 · Rituels · propositions de Présence → /care/rituels/propositions (à créer)
   - B096 · Rituels · fiche d'un rituel → /care/rituels/$id (à créer)
   - B097 · Rituels · la lettre (plein écran) → /care/rituels/lettre (à créer)
   - B098 · Rituels · organiser à plusieurs → /care/rituels/organiser (à créer)
   - B099 · Rituels · cercle de parole → /care/rituels/cercle (à créer)
   - B100 · Rituels · planter un arbre → /care/rituels/arbre (à créer)
   - B101 · Rituels · vos rituels → /care/rituels/mes-rituels (à créer)
   - B102 · Rituels · le geste est fait → /care/rituels/fait (à créer)

- Remplace la page actuelle des rituels (`src/routes/care.rituels.tsx`) par l'accueil à cinq entrées (§11, joins `plan-rituels.png`). Réutilise `rituals-catalog.ts` et `suggestRituals` (`rituals.functions.ts`).
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B12 — Rituels du monde et calendrier (captures B103, B104, B105, B106, B107, B108, B109, B110, B111, B112, B113)

```
Étape B12 sur B13 : Rituels du monde et calendrier. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B103 · Rituels du monde · les régions → /care/rituels/monde (à créer)
   - B104 · Rituels du monde · Asie → /care/rituels/monde/asie (à créer)
   - B105 · Rituels du monde · Amériques → /care/rituels/monde/ameriques (à créer)
   - B106 · Rituels du monde · Afrique → /care/rituels/monde/afrique (à créer)
   - B107 · Rituels du monde · Europe et Moyen-Orient → /care/rituels/monde/europe (à créer)
   - B108 · Rituels du monde · Océanie → /care/rituels/monde/oceanie (à créer)
   - B109 · Rituels du monde · une tradition expliquée → /care/rituels/monde/$region/$id (à créer)
   - B110 · Rituels du monde · faire une ofrenda → /care/rituels/monde/ameriques/ofrenda (à créer)
   - B111 · Rituels · calendrier → /care/rituels/calendrier (à créer)
   - B112 · Rituels · toute l'année → /care/rituels/calendrier/annee (à créer)
   - B113 · Rituels du monde · d'autres regards → /care/rituels/regards (à créer)

- Enrichis `rituals-catalog.ts` avec les 21 traditions des écrans régions (région, pays, période, description). Chaque tradition s'ouvre sur la fiche modèle.
- Le calendrier mêle les dates du monde et celles de l'utilisateur ; « Voir toute l'année » ouvre l'écran année.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B13 — Lire, écouter, voir (captures B114, B115, B116, B117, B118)

```
Étape B13 sur B13 : Lire, écouter, voir. Fais ces écrans en suivant leur capture et `legato-design/ajouts-2/02-ECRANS.md` :
   - B114 · Lire, écouter, voir · Lire → /care/resources (existe)
   - B115 · Lire, écouter, voir · Écouter → /care/resources (onglet Écouter) (existe)
   - B116 · Lire, écouter, voir · Voir → /care/resources (onglet Voir) (à créer)
   - B117 · Lire, écouter, voir · un film → /library/$kind (détail) (existe)
   - B118 · Lire, écouter, voir · suggestions de Présence → /care/resources/suggestions (à créer)

- Ajoute l'onglet Voir (films, séries, documentaires) et l'écran de suggestions de Présence (§12). Réutilise les données de ressources existantes.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message B14 — Vérification

```
Vérifie tous les ajouts :
1. Le logo LEGATO remplace le mot dans tous les en-têtes, à 66 px (crème la nuit).
2. Les quatre types d'espace changent le contenu des onglets, et le menu suit `plan-menus.png`.
3. Couleurs : rose et bleu pour le proche malade, tout en rose pour « je pense beaucoup à la mort », corail seulement après un décès.
4. Démarches suit `plan-demarches.png` ; la cérémonie n'apparaît que si les obsèques n'ont pas eu lieu.
5. La réponse « Parfois, l'envie de ne plus être là » ouvre immédiatement l'écran du 3114.
6. Le mode découverte garde tout sur le téléphone et reprend tout à la création du compte.
7. Les liens des Rituels suivent `plan-rituels.png`.
8. Chaque écran B001 à B118 ressemble à sa capture, sans lien mort.
Donne-moi la liste de ce que tu as corrigé.
```
