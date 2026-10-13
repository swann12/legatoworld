# Ajouts — inventaire complet des écrans

Ce dossier rassemble **tout ce qui a été ajouté ou modifié** depuis le premier dossier `legato-design/` (écrans 000 à 112). Il remplace le dossier `ajouts-1`. Les écrans sont numérotés **B001 à B118**.

Statut : **existe** = la route existe déjà ; **à créer** = nouvelle route ou nouvel état ; **modifié** = écran du premier dossier à mettre à jour. Quand un écran en remplace un du premier dossier, c'est indiqué.

## Tableau récapitulatif

| # | Écran | Route | Statut | Note |
|---|---|---|---|---|
| | **Écrans du premier dossier, modifiés** | | | |
| B001 | Couleurs par espace | `—` | modifié | Ajout : rose et bleu |
| B002 | Aujourd'hui | `/home` | modifié | Logo LEGATO dans l'en-tête (écran 011) |
| B003 | Le soir (mode nuit) | `/home après 21 h` | modifié | Logo LEGATO crème (écran 012) |
| B004 | Une invitation | `/invite/$token` | modifié | Logo LEGATO (écran 005) |
| B005 | C'est prêt | `/onboarding · fin` | modifié | Nouvelle mise en page (écran 010) ; même modèle pour les autres parcours |
| B006 | Présence · conversation | `/presence` | modifié | Vos messages dans un encart, Présence sur le fond (écran 031) |
| | **Visiteurs : découvrir sans compte** | | | |
| B007 | Bienvenue avec « Découvrir sans compte » | `/start` | modifié | Remplace l'écran 002 : même écran, un lien de plus |
| B008 | Découvrir sans compte | `/start/decouverte` | à créer |  |
| B009 | Aujourd'hui en mode découverte | `/home (mode découverte)` | à créer | Bandeau « Mode découverte » |
| B010 | Compte nécessaire | `/start/compte-requis` | à créer | Inviter un proche, écrire dans un groupe |
| B011 | Garder ce qui est commencé | `/start/garder` | à créer |  |
| B012 | Créer son compte | `/auth (création)` | existe |  |
| | **Démarches selon la réponse « Où en êtes-vous avec les papiers ? »** | | | |
| B013 | Démarches · avant les obsèques | `/practical (réponse « rien n'est commencé »)` | existe | La cérémonie apparaît ici |
| B014 | Démarches · après les obsèques | `/practical (réponse « obsèques passées »)` | existe |  |
| B015 | Démarches · presque tout est fait | `/practical (réponse « presque tout est fait »)` | existe |  |
| B016 | Démarches · quelqu'un s'en occupe | `/practical (réponse « quelqu'un s'en occupe »)` | existe |  |
| | **Le corps** | | | |
| B017 | Le corps · sommaire | `/help/corps` | existe | Remplace l'écran 048 |
| B018 | Ce que le deuil fait au corps | `/help/corps/comprendre` | à créer |  |
| B019 | Quand consulter | `/help/corps/consulter` | à créer |  |
| B020 | Bouger un peu | `/help/corps/bouger` | à créer |  |
| B021 | Votre petit suivi | `/help/corps/suivi` | à créer |  |
| | **Parcours « un animal qui est mort » (1/2) : première ouverture, Aujourd'hui, Soutien** | | | |
| B022 | Animal · 1 pour qui | `/onboarding · étape 1` | existe |  |
| B023 | Animal · 2 son nom | `/onboarding · étape 2` | existe |  |
| B024 | Animal · 3 où en êtes-vous | `/onboarding/practical` | existe |  |
| B025 | Animal · 4 besoins | `/onboarding/care` | existe |  |
| B026 | Animal · c'est prêt | `/onboarding · fin` | existe |  |
| B027 | Animal · Aujourd'hui | `/home (espace animal)` | à créer | Remplace l'écran 027 |
| B028 | Animal · Soutien | `/care (espace animal)` | à créer |  |
| B029 | Animal · la culpabilité | `/care/guilt` | à créer |  |
| B030 | Animal · en parler à un enfant | `/home/parler-enfant` | existe | Remplace l'écran 103 |
| B031 | Animal · un autre animal | `/care/new-animal` | à créer |  |
| | **Parcours « un animal qui est mort » (2/2) : Démarches, Mémoire, Communauté** | | | |
| B032 | Animal · Démarches | `/practical (espace animal)` | à créer |  |
| B033 | Animal · crémation ou enterrement | `/practical/animal-body` | à créer |  |
| B034 | Animal · la crémation | `/practical/animal-body/cremation` | à créer |  |
| B035 | Animal · l'enterrer dans son jardin | `/practical/animal-body/jardin` | à créer |  |
| B036 | Animal · cimetière animalier | `/practical/animal-body/cimetiere` | à créer |  |
| B037 | Animal · déclarer son décès | `/practical/animal-id` | à créer |  |
| B038 | Animal · prévenir son assurance | `/practical/animal-insurance` | à créer |  |
| B039 | Animal · arrêter les abonnements | `/practical/animal-subscriptions` | à créer |  |
| B040 | Animal · Mémoire | `/care/garden/space (espace animal)` | à créer |  |
| B041 | Animal · Communauté | `/care/community (espace animal)` | à créer |  |
| | **Parcours « un proche gravement malade » (1/2) : première ouverture, Aujourd'hui** | | | |
| B042 | Proche malade · 1 pour qui | `/onboarding · étape 1` | existe |  |
| B043 | Proche malade · 2 son prénom | `/onboarding · étape 2` | existe |  |
| B044 | Proche malade · 3 où en est-elle | `/onboarding/practical` | existe |  |
| B045 | Proche malade · 4 besoins | `/onboarding/care` | existe |  |
| B046 | Proche malade · c'est prêt | `/onboarding · fin` | existe |  |
| B047 | Proche malade · Aujourd'hui | `/home (espace proche malade)` | à créer | Remplace l'écran 026 |
| B048 | Proche malade · questions au médecin | `/home/questions-medecin` | à créer | Remplace l'écran 101 |
| B049 | Proche malade · le carnet | `/home/carnet` | à créer |  |
| B050 | Proche malade · un rendez-vous du carnet | `/home/carnet/$id` | à créer |  |
| B051 | Proche malade · noter ce qui a été dit | `/home/carnet/note` | à créer |  |
| B052 | Proche malade · qui fait quoi | `/home/equipe` | à créer |  |
| B053 | Proche malade · demander un coup de main | `/home/equipe/demande` | à créer |  |
| | **Parcours « un proche gravement malade » (2/2) : Soutien, Aides, Souvenirs, Communauté** | | | |
| B054 | Proche malade · Soutien | `/care (espace proche malade)` | à créer |  |
| B055 | Proche malade · l'épuisement | `/care/epuisement` | à créer |  |
| B056 | Proche malade · Aides | `/practical (espace proche malade)` | à créer | Onglet « Aides » |
| B057 | Proche malade · congé de proche aidant | `/practical/conge-aidant` | à créer |  |
| B058 | Proche malade · l'allocation journalière | `/practical/ajpa` | à créer |  |
| B059 | Proche malade · une aide à domicile | `/practical/aide-domicile` | à créer |  |
| B060 | Proche malade · ses volontés | `/practical/wishes (espace proche malade)` | existe |  |
| B061 | Proche malade · sa personne de confiance | `/practical/wishes/confiance` | à créer |  |
| B062 | Proche malade · ses directives anticipées | `/practical/wishes/directives` | à créer |  |
| B063 | Proche malade · Souvenirs | `/care/garden/space (espace proche malade)` | à créer | Onglet « Souvenirs » |
| B064 | Proche malade · ses histoires | `/care/garden/histoires` | à créer |  |
| B065 | Proche malade · ses recettes | `/care/garden/recettes` | à créer |  |
| B066 | Proche malade · Communauté | `/care/community (espace proche malade)` | à créer |  |
| B067 | Proche malade · si elle est décédée | `/space/settings/transition` | à créer |  |
| | **Parcours « je pense beaucoup à la mort » (1/2) : première ouverture, Aujourd'hui, Soutien** | | | |
| B068 | Penser à la mort · 1 pour qui | `/onboarding · étape 1` | existe | Choix « Moi : je pense souvent à la mort » |
| B069 | Penser à la mort · 2 ce qui vous occupe | `/onboarding · étape 2` | existe |  |
| B070 | Penser à la mort · 3 en ce moment | `/onboarding · étape 3` | existe | Sécurité |
| B071 | Penser à la mort · c'est prêt | `/onboarding · fin` | existe |  |
| B072 | Penser à la mort · Aujourd'hui | `/home (espace questions sur la mort)` | à créer | Remplace l'écran 028 |
| B073 | Penser à la mort · penser à mourir ? | `/home/penser-a-mourir` | à créer | Sécurité : 3114 |
| B074 | Penser à la mort · écrire ce qui fait peur | `/home/ecrire-peur` | à créer |  |
| B075 | Penser à la mort · Soutien | `/care (espace questions)` | à créer |  |
| B076 | Penser à la mort · l'angoisse | `/care/angoisse` | à créer |  |
| B077 | Penser à la mort · ce que d'autres en ont dit | `/care/resources (espace questions)` | à créer |  |
| | **Parcours « je pense beaucoup à la mort » (2/2) : Préparer, Transmettre, Communauté** | | | |
| B078 | Penser à la mort · Préparer | `/practical (espace questions)` | à créer | Onglet « Préparer » |
| B079 | Penser à la mort · mes souhaits pour mes obsèques | `/practical/obseques` | à créer |  |
| B080 | Penser à la mort · ma personne de confiance | `/practical/confiance` | à créer |  |
| B081 | Penser à la mort · mes directives anticipées | `/practical/directives` | à créer |  |
| B082 | Penser à la mort · le don d'organes | `/practical/don-organes` | à créer |  |
| B083 | Penser à la mort · mon testament | `/practical/testament` | à créer |  |
| B084 | Penser à la mort · un contrat obsèques | `/practical/contrat-obseques` | à créer |  |
| B085 | Penser à la mort · Transmettre | `/care/garden/space (espace questions)` | à créer | Onglet « Transmettre » |
| B086 | Penser à la mort · raconter votre vie | `/care/garden/histoire` | à créer |  |
| B087 | Penser à la mort · lettres pour plus tard | `/care/garden/lettres` | à créer |  |
| B088 | Penser à la mort · vos objets | `/care/garden/objets` | à créer |  |
| B089 | Penser à la mort · Communauté | `/care/community (espace questions)` | à créer |  |
| B090 | Penser à la mort · café mortel | `/care/community/cafe-mortel` | à créer |  |
| | **Rituels : accueil, gestes, à plusieurs** | | | |
| B091 | Rituels · accueil | `/care/rituels` | existe | Remplace l'écran 090 |
| B092 | Rituels · un geste, maintenant | `/care/rituels/maintenant` | à créer |  |
| B093 | Rituels · à plusieurs | `/care/rituels/ensemble` | à créer |  |
| B094 | Rituels · ma tradition | `/care/rituels/tradition` | à créer |  |
| B095 | Rituels · propositions de Présence | `/care/rituels/propositions` | à créer |  |
| B096 | Rituels · fiche d'un rituel | `/care/rituels/$id` | à créer |  |
| B097 | Rituels · la lettre (plein écran) | `/care/rituels/lettre` | à créer |  |
| B098 | Rituels · organiser à plusieurs | `/care/rituels/organiser` | à créer |  |
| B099 | Rituels · cercle de parole | `/care/rituels/cercle` | à créer |  |
| B100 | Rituels · planter un arbre | `/care/rituels/arbre` | à créer |  |
| B101 | Rituels · vos rituels | `/care/rituels/mes-rituels` | à créer |  |
| B102 | Rituels · le geste est fait | `/care/rituels/fait` | à créer |  |
| | **Rituels du monde et calendrier** | | | |
| B103 | Rituels du monde · les régions | `/care/rituels/monde` | à créer |  |
| B104 | Rituels du monde · Asie | `/care/rituels/monde/asie` | à créer |  |
| B105 | Rituels du monde · Amériques | `/care/rituels/monde/ameriques` | à créer |  |
| B106 | Rituels du monde · Afrique | `/care/rituels/monde/afrique` | à créer |  |
| B107 | Rituels du monde · Europe et Moyen-Orient | `/care/rituels/monde/europe` | à créer |  |
| B108 | Rituels du monde · Océanie | `/care/rituels/monde/oceanie` | à créer |  |
| B109 | Rituels du monde · une tradition expliquée | `/care/rituels/monde/$region/$id` | à créer | Modèle pour chaque tradition |
| B110 | Rituels du monde · faire une ofrenda | `/care/rituels/monde/ameriques/ofrenda` | à créer |  |
| B111 | Rituels · calendrier | `/care/rituels/calendrier` | à créer |  |
| B112 | Rituels · toute l'année | `/care/rituels/calendrier/annee` | à créer |  |
| B113 | Rituels du monde · d'autres regards | `/care/rituels/regards` | à créer |  |
| | **Lire, écouter, voir** | | | |
| B114 | Lire, écouter, voir · Lire | `/care/resources` | existe | Remplace l'écran 040 |
| B115 | Lire, écouter, voir · Écouter | `/care/resources (onglet Écouter)` | existe |  |
| B116 | Lire, écouter, voir · Voir | `/care/resources (onglet Voir)` | à créer |  |
| B117 | Lire, écouter, voir · un film | `/library/$kind (détail)` | existe | Remplace l'écran 041 pour les films |
| B118 | Lire, écouter, voir · suggestions de Présence | `/care/resources/suggestions` | à créer |  |

---

## Écrans du premier dossier, modifiés

### B001 · Couleurs par espace

- Capture (jointe au message) : `B001-palette.png` · Maquette : `maquettes.html`, section B001
- Route : `—` · **modifié** · Ajout : rose et bleu
- Ce qu'on peut toucher :
- Texte de l'écran, dans l'ordre :

```text
Une couleur par espace,
toujours la même.
Fond crème, texte vert profond. Chaque espace garde son couple, ses boutons et ses blocs.
BLOC
BOUTON
TEXTE
Aujourd'hui · bloc bleu, bouton vert profond
BLOC
BOUTON
Soutien · bloc lin, bouton bleu
BLOC
ACCENT
BOUTON
Démarches · bloc lin, accents corail, bouton bleu
BLOC
BOUTON
Mémoire, Communauté, Besoin d'aide · bloc rose, bouton bordeaux
BLOC
BOUTON
Rose et bleu · aussi possible, plus doux : parcours « proche malade »
FOND
BOUTON
Le soir, après 21 h · mode nuit, bouton menthe
```

### B002 · Aujourd'hui

- Capture (jointe au message) : `B002-aujourdhui.png` · Maquette : `maquettes.html`, section B002
- Route : `/home` · **modifié** · Logo LEGATO dans l'en-tête (écran 011)
- Ce qu'on peut toucher :
  - « Vos espaces » → écran 019 du premier dossier
  - « Besoin d'aide » → écran 018 du premier dossier
  - « Tristesse » → écran 013 du premier dossier
  - « Fatigue » → écran 013 du premier dossier
  - « Colère » → écran 013 du premier dossier
  - « Nostalgie » → écran 013 du premier dossier
  - « Autre » → écran 013 du premier dossier
  - « Commencer à écrire » → écran 038 du premier dossier
  - « Cette semaine 2 démarches, dont une avant vendredi » → écran 055 du premier dossier
  - « Dans 9 jours Son anniversaire · préparer un geste » → écran 017 du premier dossier
- Texte de l'écran, dans l'ordre :

```text
Besoin d'aide
Bonjour Victor. Cela fait trois semaines. Comment allez-vous aujourd'hui ?
Tristesse, Fatigue, Colère, Nostalgie, Autre
Pour aujourd'hui —
Écrire une lettre à mon amour
10 minutes · parce que vous vous sentez triste
Commencer à écrire
Cette semaine
2 démarches, dont une avant vendredi
Dans 9 jours
Son anniversaire · préparer un geste
```

### B003 · Le soir (mode nuit)

- Capture (jointe au message) : `B003-soir.png` · Maquette : `maquettes.html`, section B003
- Route : `/home après 21 h` · **modifié** · Logo LEGATO crème (écran 012)
- Ce qu'on peut toucher :
  - « Vos espaces » → écran 019 du premier dossier
  - « Besoin d'aide » → écran 018 du premier dossier
  - « Commencer » → écran 033 du premier dossier
  - « Des sons pour s'endormir Pluie, mer, forêt » → écran 034 du premier dossier
  - « Écrire à Présence Elle répond à toute heure » → écran B006 · Présence · conversation (`/presence`)
- Texte de l'écran, dans l'ordre :

```text
Besoin d'aide
Bonsoir Victor.
Le soir, seulement du repos.
Aucune démarche après 21 h. Elles vous attendront demain.
Pour ce soir —
Une respiration avant de dormir
5 minutes · parce que vous dormez mal ces jours-ci
Commencer
Des sons pour s'endormir
Pluie, mer, forêt
Écrire à Présence
Elle répond à toute heure
```

### B004 · Une invitation

- Capture (jointe au message) : `B004-invitation.png` · Maquette : `maquettes.html`, section B004
- Route : `/invite/$token` · **modifié** · Logo LEGATO (écran 005)
- Ce qu'on peut toucher :
  - « Rejoindre l'espace d'Anne » → écran B002 · Aujourd'hui (`/home`)
  - « Pas maintenant » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
INVITATION
Claire vous invite
dans l'espace d'Anne.
Claire a créé cet espace après le décès de sa mère. Elle aimerait partager avec vous des souvenirs et quelques démarches.
Vous pourrez —
1
Voir et ajouter des souvenirs
2
Recevoir les démarches qu'elle vous confie
Son journal, son humeur et ses échanges avec Présence restent privés.
Rejoindre l'espace d'Anne
Pas maintenant
```

### B005 · C'est prêt

- Capture (jointe au message) : `B005-cest-pret.png` · Maquette : `maquettes.html`, section B005
- Route : `/onboarding · fin` · **modifié** · Nouvelle mise en page (écran 010) ; même modèle pour les autres parcours
- Ce qu'on peut toucher :
  - « Ouvrir l'espace d'Anne » → écran B002 · Aujourd'hui (`/home`)
- Texte de l'écran, dans l'ordre :

```text
VOTRE ESPACE EST PRÊT
L'espace d'Anne
vous attend.
Voici ce que vous avez choisi. Tout se modifie ensuite dans les réglages de l'espace.
POUR
Anne, votre épouse
DEPUIS
le 8 septembre
EN PREMIER
Tenir le coup, les démarches
CHAQUE MATIN
Une seule chose à faire
APRÈS 21 H
Seulement du repos
VOS PROCHES
Rien sans votre accord
Ouvrir l'espace d'Anne
```

### B006 · Présence · conversation

- Capture (jointe au message) : `B006-presence.png` · Maquette : `maquettes.html`, section B006
- Route : `/presence` · **modifié** · Vos messages dans un encart, Présence sur le fond (écran 031)
- Ce qu'on peut toucher :
  - « Se confier » → écran 030 du premier dossier
  - « Besoin d'aide » → écran 018 du premier dossier
  - « Lui parler d'elle » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « M'apaiser » → écran 033 du premier dossier
  - « Ce qu'elle peut faire » → écran 032 du premier dossier
- Texte de l'écran, dans l'ordre :

```text
Se confier
Besoin d'aide
Présence
INTELLIGENCE ARTIFICIELLE
Je suis là. De quoi avez-vous envie de parler ce soir ?
Je n'arrive pas à dormir. La maison est trop silencieuse.
Le silence du soir revient souvent, les premières semaines. Voulez-vous me parler d'elle, ou plutôt essayer de vous apaiser un moment ?
Lui parler d'elleM'apaiser
Écrire à Présence…
Vos échanges restent privés.
Ce qu'elle peut faire
```


---

## Visiteurs : découvrir sans compte

### B007 · Bienvenue avec « Découvrir sans compte »

- Capture (jointe au message) : `B007-visiteur-bienvenue.png` · Maquette : `maquettes.html`, section B007
- Route : `/start` · **modifié** · Remplace l'écran 002 : même écran, un lien de plus
- Ce qu'on peut toucher :
  - « Créer mon espace » → écran B012 · Créer son compte (`/auth (création)`)
  - « Découvrir sans compte » → écran B008 · Découvrir sans compte (`/start/decouverte`)
  - « J'ai déjà un compte » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
BIENVENUE
Préparer
un adieu,
garder une présence.
Une application pour traverser le deuil, au jour le jour, à votre rythme.
Créer mon espace
Découvrir sans compte
J'ai déjà un compte
```

### B008 · Découvrir sans compte

- Capture (jointe au message) : `B008-visiteur-decouverte.png` · Maquette : `maquettes.html`, section B008
- Route : `/start/decouverte` · **à créer**
- Ce qu'on peut toucher :
  - « Commencer » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Créer plutôt mon espace » → écran B012 · Créer son compte (`/auth (création)`)
- Texte de l'écran, dans l'ordre :

```text
DÉCOUVERTE
Découvrir,
sans compte.
Répondez aux mêmes questions et essayez l'application. Tout reste sur ce téléphone.
Commencer
Créer plutôt mon espace
```

### B009 · Aujourd'hui en mode découverte

- Capture (jointe au message) : `B009-visiteur-aujourdhui.png` · Maquette : `maquettes.html`, section B009
- Route : `/home (mode découverte)` · **à créer** · Bandeau « Mode découverte »
- Ce qu'on peut toucher :
  - « Vos espaces » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Créer mon espace » → écran B011 · Garder ce qui est commencé (`/start/garder`)
  - « Tristesse » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Fatigue » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Colère » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Nostalgie » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Autre » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Commencer à écrire » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Inviter un proche Pour partager des souvenirs » → écran B010 · Compte nécessaire (`/start/compte-requis`)
- Texte de l'écran, dans l'ordre :

```text
Besoin d'aide
MODE DÉCOUVERTE
Rien n'est enregistré en ligne.
Créer mon espace
Bonjour. Cela fait trois semaines. Comment allez-vous aujourd'hui ?
Tristesse, Fatigue, Colère, Nostalgie, Autre
Pour aujourd'hui —
Écrire une lettre à mon amour
10 minutes · parce que vous vous sentez triste
Commencer à écrire
Inviter un proche
Pour partager des souvenirs
```

### B010 · Compte nécessaire

- Capture (jointe au message) : `B010-visiteur-compte-requis.png` · Maquette : `maquettes.html`, section B010
- Route : `/start/compte-requis` · **à créer** · Inviter un proche, écrire dans un groupe
- Ce qu'on peut toucher :
  - « Aujourd'hui » → écran B009 · Aujourd'hui en mode découverte (`/home (mode découverte)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Créer mon espace » → écran B012 · Créer son compte (`/auth (création)`)
  - « Continuer la découverte » → écran B009 · Aujourd'hui en mode découverte (`/home (mode découverte)`)
- Texte de l'écran, dans l'ordre :

```text
Aujourd'hui
Besoin d'aide
Pour inviter un proche,
créez votre espace.
Ce que vous avez déjà fait sera gardé.
Créer mon espace
Continuer la découverte
```

### B011 · Garder ce qui est commencé

- Capture (jointe au message) : `B011-visiteur-garder.png` · Maquette : `maquettes.html`, section B011
- Route : `/start/garder` · **à créer**
- Ce qu'on peut toucher :
  - « Aujourd'hui » → écran B009 · Aujourd'hui en mode découverte (`/home (mode découverte)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Créer mon espace » → écran B012 · Créer son compte (`/auth (création)`)
  - « Plus tard » → écran B009 · Aujourd'hui en mode découverte (`/home (mode découverte)`)
- Texte de l'écran, dans l'ordre :

```text
Aujourd'hui
Besoin d'aide
Garder ce que
vous avez commencé ?
Vos réponses, votre page de journal et vos deux souvenirs seront gardés dans votre espace.
Créer mon espace
Plus tard
```

### B012 · Créer son compte

- Capture (jointe au message) : `B012-visiteur-creer-compte.png` · Maquette : `maquettes.html`, section B012
- Route : `/auth (création)` · **existe**
- Ce qu'on peut toucher :
  - « Créer mon espace » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « J'ai déjà un compte » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
VOTRE ESPACE
Créer
votre espace.
VOTRE PRÉNOM
Victor
ADRESSE E-MAIL
victor@exemple.fr
MOT DE PASSE
••••••••••
Créer mon espace
J'ai déjà un compte
```


---

## Démarches selon la réponse « Où en êtes-vous avec les papiers ? »

### B013 · Démarches · avant les obsèques

- Capture (jointe au message) : `B013-demarches-avant-obseques.png` · Maquette : `maquettes.html`, section B013
- Route : `/practical (réponse « rien n'est commencé »)` · **existe** · La cérémonie apparaît ici
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 Choisir les pompes funèbres Elles déclarent aussi le décès » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 2 Organiser la cérémonie Le lieu, la date, les détails » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 3 Prévenir les proches Un message prêt à envoyer » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
Les premiers jours,
dans l'ordre.
Les obsèques ont lieu dans les six jours ouvrables. Seulement l'essentiel.
Aujourd'hui ou demain —
1
Choisir les pompes funèbres
Elles déclarent aussi le décès
2
Organiser la cérémonie
Le lieu, la date, les détails
3
Prévenir les proches
Un message prêt à envoyer
Après les obsèques, la banque, les organismes et la succession apparaîtront ici. Rien ne presse avant.
```

### B014 · Démarches · après les obsèques

- Capture (jointe au message) : `B014-demarches-apres-obseques.png` · Maquette : `maquettes.html`, section B014
- Route : `/practical (réponse « obsèques passées »)` · **existe**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 Commander l'acte de décès 10 min · mairie » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 2 Prévenir la banque 15 min · courrier prêt » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 3 Retraite, assurance maladie, mutuelle ce mois-ci » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 4 La succession avec un notaire, dans les six mois » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
Ce qu'il reste
à faire.
La cérémonie
faite le 14 septembre
Cette semaine —
1
Commander l'acte de décès
10 min · mairie
2
Prévenir la banque
15 min · courrier prêt
Ensuite —
3
Retraite, assurance maladie, mutuelle
ce mois-ci
4
La succession
avec un notaire, dans les six mois
```

### B015 · Démarches · presque tout est fait

- Capture (jointe au message) : `B015-demarches-presque-fini.png` · Maquette : `maquettes.html`, section B015
- Route : `/practical (réponse « presque tout est fait »)` · **existe**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 La déclaration de succession avec le notaire · avant le 8 mars » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 2 Résilier les derniers contrats téléphone, abonnements » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Revoir ce qui est fait » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
Presque
terminé.
7/8
FAITES
Il reste —
1
La déclaration de succession
avec le notaire · avant le 8 mars
2
Résilier les derniers contrats
téléphone, abonnements
Revoir ce qui est fait
```

### B016 · Démarches · quelqu'un s'en occupe

- Capture (jointe au message) : `B016-demarches-confiees.png` · Maquette : `maquettes.html`, section B016
- Route : `/practical (réponse « quelqu'un s'en occupe »)` · **existe**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir le document » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir toutes les démarches » → écran B014 · Démarches · après les obsèques (`/practical (réponse « obsèques passées »)`)
  - « Les reprendre moi-même » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
Claire s'occupe
des démarches.
Vous ne voyez que ce qu'elle vous demande.
Claire a besoin de vous —
Signer le mandat pour la banque
Un document · 2 minutes
Voir le document
Voir toutes les démarches
Les reprendre moi-même
```


---

## Le corps

### B017 · Le corps · sommaire

- Capture (jointe au message) : `B017-corps.png` · Maquette : `maquettes.html`, section B017
- Route : `/help/corps` · **existe** · Remplace l'écran 048
- Ce qu'on peut toucher :
  - « Soutien » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 01 Dormir les nuits » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 02 Manger même peu » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 03 Se laver un geste à la fois » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 04 S'habiller sans y penser » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 05 Bouger dix minutes » → écran B020 · Bouger un peu (`/help/corps/bouger`)
  - « 06 Un soin pour vous » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ce que le deuil fait au corps ↗ » → écran B018 · Ce que le deuil fait au corps (`/help/corps/comprendre`)
  - « Quand consulter ↗ » → écran B019 · Quand consulter (`/help/corps/consulter`)
  - « Votre petit suivi ↗ » → écran B021 · Votre petit suivi (`/help/corps/suivi`)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Prendre soin
de votre corps.
01
Dormir
les nuits
02
Manger
même peu
03
Se laver
un geste à la fois
04
S'habiller
sans y penser
05
Bouger
dix minutes
06
Un soin
pour vous
Comprendre et suivre —
Ce que le deuil fait au corps
↗
Quand consulter
↗
Votre petit suivi
↗
```

### B018 · Ce que le deuil fait au corps

- Capture (jointe au message) : `B018-corps-comprendre.png` · Maquette : `maquettes.html`, section B018
- Route : `/help/corps/comprendre` · **à créer**
- Ce qu'on peut toucher :
  - « Le corps » → écran B017 · Le corps · sommaire (`/help/corps`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Quand faut-il consulter ? » → écran B019 · Quand consulter (`/help/corps/consulter`)
- Texte de l'écran, dans l'ordre :

```text
Le corps
Besoin d'aide
Ce que le deuil
fait au corps.
C'est fréquent, et cela s'apaise avec le temps.
Une fatigue lourde
même après une nuit complète
La gorge serrée, la poitrine oppressée
souvent par vagues
L'appétit coupé, ou l'envie de grignoter
les deux sont fréquents
Des douleurs : tête, ventre, dos
le corps porte la tension
Quand faut-il consulter ?
```

### B019 · Quand consulter

- Capture (jointe au message) : `B019-corps-consulter.png` · Maquette : `maquettes.html`, section B019
- Route : `/help/corps/consulter` · **à créer**
- Ce qu'on peut toucher :
  - « Le corps » → écran B017 · Le corps · sommaire (`/help/corps`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Le 15 » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Des idées noires ? Parler à quelqu'un maintenant » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Le corps
Besoin d'aide
Quand consulter.
Tout de suite —
Douleur dans la poitrine, essoufflement soudain, malaise.
Le 15
Votre médecin, si —
1
Vous dormez très peu depuis plus de deux semaines.
2
Vous ne mangez presque plus depuis plusieurs jours.
3
La fatigue vous empêche de sortir de chez vous.
Des idées noires ? Parler à quelqu'un maintenant
```

### B020 · Bouger un peu

- Capture (jointe au message) : `B020-corps-bouger.png` · Maquette : `maquettes.html`, section B020
- Route : `/help/corps/bouger` · **à créer**
- Ce qu'on peut toucher :
  - « Le corps » → écran B017 · Le corps · sommaire (`/help/corps`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Marcher avec une voix » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Le corps
Besoin d'aide
Bouger
un peu.
10
MINUTES
Pas de sport, pas d'objectif. Remettre le corps en mouvement, doucement.
Ce qui aide —
1
Marcher dehors, même lentement.
2
Étirer le dos et les épaules en vous levant.
3
Le faire avec quelqu'un, si possible.
Marcher avec une voix
```

### B021 · Votre petit suivi

- Capture (jointe au message) : `B021-corps-suivi.png` · Maquette : `maquettes.html`, section B021
- Route : `/help/corps/suivi` · **à créer**
- Ce qu'on peut toucher :
  - « Le corps » → écran B017 · Le corps · sommaire (`/help/corps`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Noter aujourd'hui » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Le corps
Besoin d'aide
Votre
petit suivi.
Sans note, sans objectif. Juste pour voir ce qui va un peu mieux.
L
J
S
D
Dormi
Mangé
Lavé
Sorti
Vous êtes sorti deux fois de plus que la semaine dernière.
Noter aujourd'hui
```


---

## Parcours « un animal qui est mort » (1/2) : première ouverture, Aujourd'hui, Soutien

### B022 · Animal · 1 pour qui

- Capture (jointe au message) : `B022-animal-onb-1.png` · Maquette : `maquettes.html`, section B022
- Route : `/onboarding · étape 1` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B023 · Animal · 2 son nom (`/onboarding · étape 2`)
- Texte de l'écran, dans l'ordre :

```text
Pour qui créez-vous
cet espace ?
Choisissez la situation la plus proche. Vous pourrez créer d'autres espaces plus tard.
Une personne qui est décédée
Soutien, démarches, mémoire
Un animal qui est mort
Soutien, démarches et mémoire
Un proche gravement malade
L'accompagner et prendre soin de vous
Moi, pour préparer l'avenir
Comprendre, écrire mes volontés
Continuer
```

### B023 · Animal · 2 son nom

- Capture (jointe au message) : `B023-animal-onb-2.png` · Maquette : `maquettes.html`, section B023
- Route : `/onboarding · étape 2` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B024 · Animal · 3 où en êtes-vous (`/onboarding/practical`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Comment s'appelait
votre animal ?
Legato utilisera son nom pour vous parler de lui. Personne d'autre ne le verra.
SON NOM
Ulysse
C'ÉTAIT
Un chien
IL EST MORT LE · FACULTATIF
2 octobre 2026
Continuer
Passer cette étape
```

### B024 · Animal · 3 où en êtes-vous

- Capture (jointe au message) : `B024-animal-onb-3.png` · Maquette : `maquettes.html`, section B024
- Route : `/onboarding/practical` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B025 · Animal · 4 besoins (`/onboarding/care`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Où en êtes-vous
pour son corps ?
Pour vous montrer seulement ce qui reste à faire.
Il est encore chez le vétérinaire
Rien n'est décidé
C'est en cours
Crémation ou enterrement organisé
Tout est fait
Il reste peut-être quelques papiers
Je préfère ne pas y penser
Les démarches resteront masquées
Continuer
Passer cette étape
```

### B025 · Animal · 4 besoins

- Capture (jointe au message) : `B025-animal-onb-4.png` · Maquette : `maquettes.html`, section B025
- Route : `/onboarding/care` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B026 · Animal · c'est prêt (`/onboarding · fin`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
De quoi avez-vous
besoin en ce moment ?
Plusieurs choix possibles. Le reste restera accessible.
Tenir le coup au jour le jour
Une proposition courte chaque matin
M'occuper de son corps et des papiers
Crémation, enterrement, déclarations
Garder sa mémoire
Photos, vidéos, ses objets
En parler à un enfant
Des mots simples pour expliquer
Continuer
Passer cette étape
```

### B026 · Animal · c'est prêt

- Capture (jointe au message) : `B026-animal-cest-pret.png` · Maquette : `maquettes.html`, section B026
- Route : `/onboarding · fin` · **existe**
- Ce qu'on peut toucher :
  - « Ouvrir l'espace d'Ulysse » → écran B027 · Animal · Aujourd'hui (`/home (espace animal)`)
- Texte de l'écran, dans l'ordre :

```text
VOTRE ESPACE EST PRÊT
L'espace d'Ulysse
vous attend.
Voici ce que vous avez choisi. Tout se modifie ensuite dans les réglages de l'espace.
POUR
Ulysse, votre chien
DEPUIS
le 2 octobre
EN PREMIER
Tenir le coup, son corps
CHAQUE MATIN
Une seule chose à faire
LES PAPIERS
Dans l'ordre
SA MÉMOIRE
Photos et souvenirs
Ouvrir l'espace d'Ulysse
```

### B027 · Animal · Aujourd'hui

- Capture (jointe au message) : `B027-animal-aujourdhui.png` · Maquette : `maquettes.html`, section B027
- Route : `/home (espace animal)` · **à créer** · Remplace l'écran 027
- Ce qu'on peut toucher :
  - « Vos espaces » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Tristesse » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Culpabilité » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Vide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Autre » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir les possibilités » → écran B033 · Animal · crémation ou enterrement (`/practical/animal-body`)
  - « Cette semaine 2 démarches, rien d'urgent » → écran B032 · Animal · Démarches (`/practical (espace animal)`)
  - « Si vous vous sentez coupable C'est très fréquent, surtout après une euthanasie » → écran B029 · Animal · la culpabilité (`/care/guilt`)
- Texte de l'écran, dans l'ordre :

```text
Besoin d'aide
Ulysse vous manque.
C'est un vrai chagrin.
Tristesse, Culpabilité, Vide, Autre
Pour aujourd'hui —
Choisir sa crémation ou son enterrement
10 minutes · il est encore chez le vétérinaire
Voir les possibilités
Cette semaine
2 démarches, rien d'urgent
Si vous vous sentez coupable
C'est très fréquent, surtout après une euthanasie
```

### B028 · Animal · Soutien

- Capture (jointe au message) : `B028-animal-soutien.png` · Maquette : `maquettes.html`, section B028
- Route : `/care (espace animal)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Se confier À Présence, ou à des personnes qui ont vécu la même chose » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Si vous vous sentez coupable Après une euthanasie ou un accident » → écran B029 · Animal · la culpabilité (`/care/guilt`)
  - « Écrire une lettre à Ulysse Lui dire ce qui n'a pas été dit » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « En parler à un enfant Des mots simples et vrais » → écran B030 · Animal · en parler à un enfant (`/home/parler-enfant`)
  - « Un autre animal, un jour ? Rien ne presse » → écran B031 · Animal · un autre animal (`/care/new-animal`)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Prendre soin
de vous.
Perdre un animal, c'est perdre une présence de chaque jour. Votre peine est légitime.
Maintenant —
Se confier
À Présence, ou à des personnes qui ont vécu la même chose
Si vous vous sentez coupable
Après une euthanasie ou un accident
Écrire une lettre à Ulysse
Lui dire ce qui n'a pas été dit
En parler à un enfant
Des mots simples et vrais
Un autre animal, un jour ?
Rien ne presse
```

### B029 · Animal · la culpabilité

- Capture (jointe au message) : `B029-animal-culpabilite.png` · Maquette : `maquettes.html`, section B029
- Route : `/care/guilt` · **à créer**
- Ce qu'on peut toucher :
  - « Soutien » → écran B028 · Animal · Soutien (`/care (espace animal)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « En parler à Présence » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Si vous vous sentez
coupable.
« J'aurais dû voir plus tôt. » « Ai-je décidé trop vite ? » Ces pensées sont très fréquentes. Elles disent surtout combien vous l'aimiez.
Ce qui aide —
1
Rappelez-vous que vous avez décidé avec ce que vous saviez à ce moment-là.
2
L'euthanasie a évité qu'il souffre davantage : c'est un dernier soin.
3
Parlez-en à votre vétérinaire : il peut répondre à vos questions.
En parler à Présence
```

### B030 · Animal · en parler à un enfant

- Capture (jointe au message) : `B030-animal-enfant.png` · Maquette : `maquettes.html`, section B030
- Route : `/home/parler-enfant` · **existe** · Remplace l'écran 103
- Ce qu'on peut toucher :
  - « Soutien » → écran B028 · Animal · Soutien (`/care (espace animal)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Lire : expliquer la mort d'un animal à un enfant » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
En parler
à un enfant.
Les enfants comprennent mieux des mots simples et vrais que des détours.
Ce qui aide —
1
Dites « Ulysse est mort », plutôt que « il est parti » ou « il dort ».
2
Répondez à ses questions, même si elles reviennent souvent.
3
Proposez-lui un geste : un dessin, une photo à garder, un mot pour lui.
Lire : expliquer la mort d'un animal à un enfant
```

### B031 · Animal · un autre animal

- Capture (jointe au message) : `B031-animal-nouvel-animal.png` · Maquette : `maquettes.html`, section B031
- Route : `/care/new-animal` · **à créer**
- Ce qu'on peut toucher :
  - « Soutien » → écran B028 · Animal · Soutien (`/care (espace animal)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Un autre animal,
un jour ?
Il n'y a pas de bon délai. Certaines personnes en accueillent un vite, d'autres jamais. Les deux sont normaux.
Quelques questions à vous poser —
1
Est-ce que je cherche à le remplacer, ou à accueillir un nouvel animal ?
2
Est-ce que toute la famille est prête ?
3
Est-ce que je pourrai l'aimer pour lui-même ?
```


---

## Parcours « un animal qui est mort » (2/2) : Démarches, Mémoire, Communauté

### B032 · Animal · Démarches

- Capture (jointe au message) : `B032-animal-demarches.png` · Maquette : `maquettes.html`, section B032
- Route : `/practical (espace animal)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 Crémation ou enterrement À décider avec le vétérinaire » → écran B033 · Animal · crémation ou enterrement (`/practical/animal-body`)
  - « 2 Déclarer son décès Fichier national d'identification · 5 min » → écran B037 · Animal · déclarer son décès (`/practical/animal-id`)
  - « 3 Prévenir son assurance Si Ulysse était assuré » → écran B038 · Animal · prévenir son assurance (`/practical/animal-insurance`)
  - « 4 Arrêter les abonnements Croquettes, mutuelle animale » → écran B039 · Animal · arrêter les abonnements (`/practical/animal-subscriptions`)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
Ce qu'il reste
à faire.
0/4
Rien d'urgent
Pour son corps —
1
Crémation ou enterrement
À décider avec le vétérinaire
Les papiers —
2
Déclarer son décès
Fichier national d'identification · 5 min
3
Prévenir son assurance
Si Ulysse était assuré
4
Arrêter les abonnements
Croquettes, mutuelle animale
```

### B033 · Animal · crémation ou enterrement

- Capture (jointe au message) : `B033-animal-corps.png` · Maquette : `maquettes.html`, section B033
- Route : `/practical/animal-body` · **à créer**
- Ce qu'on peut toucher :
  - « Démarches » → écran B032 · Animal · Démarches (`/practical (espace animal)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Crémation individuelle Vous récupérez ses cendres dans une urne SUR DEVIS » → écran B034 · Animal · la crémation (`/practical/animal-body/cremation`)
  - « Crémation collective Avec d'autres animaux, sans retour des cendres MOINS CHER » → écran B034 · Animal · la crémation (`/practical/animal-body/cremation`)
  - « Enterrement dans votre jardin Possible sous conditions, voir ci-dessous GRATUIT » → écran B035 · Animal · l'enterrer dans son jardin (`/practical/animal-body/jardin`)
  - « Cimetière animalier Une tombe où vous pourrez revenir SUR DEVIS » → écran B036 · Animal · cimetière animalier (`/practical/animal-body/cimetiere`)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
Crémation
ou enterrement.
Le vétérinaire peut le garder quelques jours, le temps de décider.
Crémation individuelle
Vous récupérez ses cendres dans une urne
SUR DEVIS
Crémation collective
Avec d'autres animaux, sans retour des cendres
MOINS CHER
Enterrement dans votre jardin
Possible sous conditions, voir ci-dessous
GRATUIT
Cimetière animalier
Une tombe où vous pourrez revenir
SUR DEVIS
Jardin : en général moins de 40 kg, à plus de 35 m des habitations et des points d'eau. Vérifiez auprès de votre mairie.
```

### B034 · Animal · la crémation

- Capture (jointe au message) : `B034-animal-cremation.png` · Maquette : `maquettes.html`, section B034
- Route : `/practical/animal-body/cremation` · **à créer**
- Ce qu'on peut toucher :
  - « Crémation ou enterrement » → écran B033 · Animal · crémation ou enterrement (`/practical/animal-body`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Crémation ou enterrement
Besoin d'aide
La crémation.
Le vétérinaire l'organise avec un crématorium pour animaux. Comptez une à deux semaines.
INDIVIDUELLE
Ses cendres vous sont rendues dans une urne
COLLECTIVE
Avec d'autres animaux, sans retour des cendres
PRIX
Selon son poids : demandez un devis
Les étapes —
Dire au vétérinaire la formule choisie
Choisir une urne, si vous le souhaitez
Récupérer ses cendres
```

### B035 · Animal · l'enterrer dans son jardin

- Capture (jointe au message) : `B035-animal-jardin.png` · Maquette : `maquettes.html`, section B035
- Route : `/practical/animal-body/jardin` · **à créer**
- Ce qu'on peut toucher :
  - « Crémation ou enterrement » → écran B033 · Animal · crémation ou enterrement (`/practical/animal-body`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Crémation ou enterrement
Besoin d'aide
L'enterrer
dans votre jardin.
C'est possible si vous êtes propriétaire du terrain, sous quelques conditions.
Les conditions habituelles —
1
Un animal de moins de 40 kg.
2
À plus de 35 mètres des maisons et des points d'eau.
3
Assez profond : au moins un mètre de terre au-dessus.
Les règles peuvent varier : vérifiez auprès de votre mairie avant.
```

### B036 · Animal · cimetière animalier

- Capture (jointe au message) : `B036-animal-cimetiere.png` · Maquette : `maquettes.html`, section B036
- Route : `/practical/animal-body/cimetiere` · **à créer**
- Ce qu'on peut toucher :
  - « Crémation ou enterrement » → écran B033 · Animal · crémation ou enterrement (`/practical/animal-body`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Trouver un cimetière proche » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Crémation ou enterrement
Besoin d'aide
Un cimetière
pour animaux.
Une tombe où vous pourrez revenir. On loue l'emplacement pour quelques années, renouvelables.
OÙ
Il en existe dans la plupart des régions
DURÉE
Quelques années, renouvelables
AVANT
Demander les prix et l'entretien
Trouver un cimetière proche
```

### B037 · Animal · déclarer son décès

- Capture (jointe au message) : `B037-animal-declarer.png` · Maquette : `maquettes.html`, section B037
- Route : `/practical/animal-id` · **à créer**
- Ce qu'on peut toucher :
  - « Démarches » → écran B032 · Animal · Démarches (`/practical (espace animal)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ouvrir le site de déclaration » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
SI ULYSSE ÉTAIT PUCÉ OU TATOUÉ
Déclarer
son décès.
AUPRÈS DE
Le fichier national d'identification (I-CAD)
QUI
Votre vétérinaire, ou vous en ligne
DURÉE
5 minutes
Les étapes · 0 sur 2 —
Demander au vétérinaire s'il s'en charge
Sinon, le déclarer en ligne avec son numéro d'identification
Ouvrir le site de déclaration
```

### B038 · Animal · prévenir son assurance

- Capture (jointe au message) : `B038-animal-assurance.png` · Maquette : `maquettes.html`, section B038
- Route : `/practical/animal-insurance` · **à créer**
- Ce qu'on peut toucher :
  - « Démarches » → écran B032 · Animal · Démarches (`/practical (espace animal)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Utiliser le courrier prêt » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
SI ULYSSE ÉTAIT ASSURÉ
Prévenir
son assurance.
POURQUOI
Arrêter le contrat et les prélèvements
IL VOUS FAUT
Le certificat de décès du vétérinaire
DURÉE
10 minutes
Utiliser le courrier prêt
```

### B039 · Animal · arrêter les abonnements

- Capture (jointe au message) : `B039-animal-abonnements.png` · Maquette : `maquettes.html`, section B039
- Route : `/practical/animal-subscriptions` · **à créer**
- Ce qu'on peut toucher :
  - « Démarches » → écran B032 · Animal · Démarches (`/practical (espace animal)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Préparer les messages » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Démarches
Besoin d'aide
Arrêter
les abonnements.
Pour ne pas recevoir ce qui était pour lui. Cochez ce qui le concerne.
Livraison de croquettes
Mutuelle animale
Pension, garde, promeneur
Toilettage
Préparer les messages
```

### B040 · Animal · Mémoire

- Capture (jointe au message) : `B040-animal-memoire.png` · Maquette : `maquettes.html`, section B040
- Route : `/care/garden/space (espace animal)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « DERNIER SOUVENIR · PHOTO Sur la plage, l'hiver « Il courait après chaque vague. » » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Tous ses souvenirs Photos, vidéos, ses objets » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Un geste pour lui Une bougie, quelques mots » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Son collier, sa gamelle Que garder, à votre rythme » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ajouter un souvenir » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Mémoire
Besoin d'aide
Le jardin
d'Ulysse.
Six souvenirs gardés. Le dernier, hier.
DERNIER SOUVENIR · PHOTO
Sur la plage, l'hiver
« Il courait après chaque vague. »
Tous ses souvenirs
Photos, vidéos, ses objets
Un geste pour lui
Une bougie, quelques mots
Son collier, sa gamelle
Que garder, à votre rythme
Ajouter un souvenir
```

### B041 · Animal · Communauté

- Capture (jointe au message) : `B041-animal-communaute.png` · Maquette : `maquettes.html`, section B041
- Route : `/care/community (espace animal)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Perte d'un chien 64 membres · très actif » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Après une euthanasie 38 membres » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Expliquer aux enfants 21 membres » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir la veillée » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Communauté
Besoin d'aide
Parler avec d'autres
qui ont perdu un animal.
Groupes modérés. Un pseudonyme suffit.
Groupes conseillés —
Perte d'un chien
64 membres · très actif
Après une euthanasie
38 membres
Expliquer aux enfants
21 membres
Prochaine veillée —
MARDI · 20 H
Ils faisaient partie de la famille
Voir la veillée
```


---

## Parcours « un proche gravement malade » (1/2) : première ouverture, Aujourd'hui

### B042 · Proche malade · 1 pour qui

- Capture (jointe au message) : `B042-malade-onb-1.png` · Maquette : `maquettes.html`, section B042
- Route : `/onboarding · étape 1` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B043 · Proche malade · 2 son prénom (`/onboarding · étape 2`)
- Texte de l'écran, dans l'ordre :

```text
Pour qui créez-vous
cet espace ?
Choisissez la situation la plus proche. Vous pourrez créer d'autres espaces plus tard.
Une personne qui est décédée
Soutien, démarches, mémoire
Un animal qui est mort
Soutien, démarches et mémoire
Un proche gravement malade
L'accompagner et prendre soin de vous
Moi, pour préparer l'avenir
Comprendre, écrire mes volontés
Continuer
```

### B043 · Proche malade · 2 son prénom

- Capture (jointe au message) : `B043-malade-onb-2.png` · Maquette : `maquettes.html`, section B043
- Route : `/onboarding · étape 2` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B044 · Proche malade · 3 où en est-elle (`/onboarding/practical`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Qui accompagnez-vous ?
Legato utilisera ce nom pour vous parler d'elle. Personne d'autre ne le verra.
SON PRÉNOM, OU LE NOM QUE VOUS LUI DONNEZ
Maman
VOTRE LIEN AVEC ELLE
Ma mère
CE QUI SE PASSE, EN QUELQUES MOTS · FACULTATIF
Un cancer, soigné depuis l'été
Continuer
Passer cette étape
```

### B044 · Proche malade · 3 où en est-elle

- Capture (jointe au message) : `B044-malade-onb-3.png` · Maquette : `maquettes.html`, section B044
- Route : `/onboarding/practical` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B045 · Proche malade · 4 besoins (`/onboarding/care`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Où en est-elle
aujourd'hui ?
Pour vous proposer ce qui correspond à ce moment.
Elle est soignée, à l'hôpital ou en ville
Rendez-vous, traitements
Elle est soignée à la maison
Avec des soignants qui passent
Elle est en soins palliatifs
Les soins visent son confort
Je ne sais pas trop
On fera le point ensemble plus tard
Continuer
Passer cette étape
```

### B045 · Proche malade · 4 besoins

- Capture (jointe au message) : `B045-malade-onb-4.png` · Maquette : `maquettes.html`, section B045
- Route : `/onboarding/care` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B046 · Proche malade · c'est prêt (`/onboarding · fin`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
De quoi avez-vous
besoin en ce moment ?
Plusieurs choix possibles. Le reste restera accessible.
Tenir le coup au jour le jour
Une proposition courte chaque matin
Préparer les rendez-vous médicaux
Vos questions, ce qui a été dit
Connaître mes droits d'aidant
Congé, aides, relais
Parler à d'autres aidants
Groupes et veillées en visio
Continuer
Passer cette étape
```

### B046 · Proche malade · c'est prêt

- Capture (jointe au message) : `B046-malade-cest-pret.png` · Maquette : `maquettes.html`, section B046
- Route : `/onboarding · fin` · **existe**
- Ce qu'on peut toucher :
  - « Ouvrir l'espace » → écran B047 · Proche malade · Aujourd'hui (`/home (espace proche malade)`)
- Texte de l'écran, dans l'ordre :

```text
VOTRE ESPACE EST PRÊT
L'espace pour Maman
vous attend.
Voici ce que vous avez choisi. Tout se modifie ensuite dans les réglages de l'espace.
POUR
Maman, votre mère
AUJOURD'HUI
Soignée à l'hôpital
EN PREMIER
Tenir le coup, ses rendez-vous
CHAQUE MATIN
Pour elle ou pour vous
LE CARNET
Ses rendez-vous
VOS DROITS
Expliqués simplement
Ouvrir l'espace
```

### B047 · Proche malade · Aujourd'hui

- Capture (jointe au message) : `B047-malade-aujourdhui.png` · Maquette : `maquettes.html`, section B047
- Route : `/home (espace proche malade)` · **à créer** · Remplace l'écran 026
- Ce qu'on peut toucher :
  - « Vos espaces » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Inquiet » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Épuisé » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Serein » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Autre » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Préparer mes questions » → écran B048 · Proche malade · questions au médecin (`/home/questions-medecin`)
  - « Ses prochains rendez-vous Jeudi 10 h · Claire l'accompagne » → écran B049 · Proche malade · le carnet (`/home/carnet`)
  - « Si vous n'en pouvez plus Trouver un relais, souffler un peu » → écran B055 · Proche malade · l'épuisement (`/care/epuisement`)
- Texte de l'écran, dans l'ordre :

```text
Besoin d'aide
Et vous, comment allez-vous aujourd'hui ?
Inquiet, Épuisé, Serein, Autre
Pour aujourd'hui —
Préparer vos questions pour l'oncologue
Rendez-vous jeudi · 10 minutes
Préparer mes questions
Ses prochains rendez-vous
Jeudi 10 h · Claire l'accompagne
Si vous n'en pouvez plus
Trouver un relais, souffler un peu
```

### B048 · Proche malade · questions au médecin

- Capture (jointe au message) : `B048-malade-questions.png` · Maquette : `maquettes.html`, section B048
- Route : `/home/questions-medecin` · **à créer** · Remplace l'écran 101
- Ce qu'on peut toucher :
  - « Aujourd'hui » → écran B047 · Proche malade · Aujourd'hui (`/home (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Garder pour jeudi » → écran B049 · Proche malade · le carnet (`/home/carnet`)
- Texte de l'écran, dans l'ordre :

```text
Aujourd'hui
Besoin d'aide
RENDEZ-VOUS JEUDI · 10 H · TIMONE
Vos questions
pour l'oncologue.
Gardez celles qui vous parlent. Vous les retrouverez jeudi, dans le carnet.
Comment va-t-elle réagir au traitement ?
Que pouvons-nous faire à la maison ?
Qui appeler en cas de doute, le soir ?
Comment prendre soin de moi aussi ?
Ajouter votre question…
Garder pour jeudi
```

### B049 · Proche malade · le carnet

- Capture (jointe au message) : `B049-malade-carnet.png` · Maquette : `maquettes.html`, section B049
- Route : `/home/carnet` · **à créer**
- Ce qu'on peut toucher :
  - « Aujourd'hui » → écran B047 · Proche malade · Aujourd'hui (`/home (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 9 OCT. Oncologue, Dr Martin 10 h · Timone · Claire l'accompagne » → écran B050 · Proche malade · un rendez-vous du carnet (`/home/carnet/$id`)
  - « 16 OCT. Séance de chimiothérapie Toute la matinée » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ajouter une note » → écran B051 · Proche malade · noter ce qui a été dit (`/home/carnet/note`)
- Texte de l'écran, dans l'ordre :

```text
Aujourd'hui
Besoin d'aide
Le carnet
de Maman.
Ses rendez-vous, ce qui a été dit, ce qu'il faut retenir. Partagé avec les proches que vous choisissez.
À venir —
9
OCT.
Oncologue, Dr Martin
10 h · Timone · Claire l'accompagne
16
OCT.
Séance de chimiothérapie
Toute la matinée
La dernière fois —
2 OCTOBRE · ONCOLOGUE
Le traitement continue. Prochain bilan dans un mois. Appeler le service si la fièvre dépasse 38,5 °C.
Ajouter une note
```

### B050 · Proche malade · un rendez-vous du carnet

- Capture (jointe au message) : `B050-malade-rdv.png` · Maquette : `maquettes.html`, section B050
- Route : `/home/carnet/$id` · **à créer**
- Ce qu'on peut toucher :
  - « Le carnet » → écran B049 · Proche malade · le carnet (`/home/carnet`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Noter ce qui a été dit » → écran B051 · Proche malade · noter ce qui a été dit (`/home/carnet/note`)
- Texte de l'écran, dans l'ordre :

```text
Le carnet
Besoin d'aide
JEUDI 9 OCTOBRE · 10 H
Oncologue,
Dr Martin.
OÙ
Hôpital de la Timone
AVEC ELLE
Claire
Vos questions —
Comment va-t-elle réagir au traitement ?
Que pouvons-nous faire à la maison ?
Noter ce qui a été dit
```

### B051 · Proche malade · noter ce qui a été dit

- Capture (jointe au message) : `B051-malade-note.png` · Maquette : `maquettes.html`, section B051
- Route : `/home/carnet/note` · **à créer**
- Ce qu'on peut toucher :
  - « Le carnet » → écran B049 · Proche malade · le carnet (`/home/carnet`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Garder dans le carnet » → écran B049 · Proche malade · le carnet (`/home/carnet`)
  - « Dicter plutôt » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Le carnet
Besoin d'aide
Ce qui
a été dit.
Notez l'essentiel juste après le rendez-vous. Vos proches du carnet le verront.
Le traitement continue, prochain bilan dans un mois…
Garder dans le carnet
Dicter plutôt
```

### B052 · Proche malade · qui fait quoi

- Capture (jointe au message) : `B052-malade-equipe.png` · Maquette : `maquettes.html`, section B052
- Route : `/home/equipe` · **à créer**
- Ce qu'on peut toucher :
  - « Aujourd'hui » → écran B047 · Proche malade · Aujourd'hui (`/home (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Jeudi · l'accompagner à la Timone Claire ACCEPTÉ » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Samedi · les courses Paul EN ATTENTE » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Dimanche · lui rendre visite Personne pour l'instant » → écran B053 · Proche malade · demander un coup de main (`/home/equipe/demande`)
  - « Demander » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ajouter une tâche » → écran B053 · Proche malade · demander un coup de main (`/home/equipe/demande`)
- Texte de l'écran, dans l'ordre :

```text
Aujourd'hui
Besoin d'aide
Qui fait quoi,
cette semaine.
Pour ne pas tout porter seul. Chacun voit ce qu'il a accepté de faire.
Jeudi · l'accompagner à la Timone
Claire
ACCEPTÉ
Samedi · les courses
Paul
EN ATTENTE
Dimanche · lui rendre visite
Personne pour l'instant
Demander
Ajouter une tâche
```

### B053 · Proche malade · demander un coup de main

- Capture (jointe au message) : `B053-malade-tache.png` · Maquette : `maquettes.html`, section B053
- Route : `/home/equipe/demande` · **à créer**
- Ce qu'on peut toucher :
  - « Qui fait quoi » → écran B052 · Proche malade · qui fait quoi (`/home/equipe`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Envoyer la demande » → écran B052 · Proche malade · qui fait quoi (`/home/equipe`)
- Texte de l'écran, dans l'ordre :

```text
Qui fait quoi
Besoin d'aide
Demander
un coup de main.
QUOI
Lui rendre visite
QUAND
Dimanche après-midi
À QUI
Paul, Jeanne
Ils reçoivent un message simple. Le premier qui accepte s'en charge.
Envoyer la demande
```


---

## Parcours « un proche gravement malade » (2/2) : Soutien, Aides, Souvenirs, Communauté

### B054 · Proche malade · Soutien

- Capture (jointe au message) : `B054-malade-soutien.png` · Maquette : `maquettes.html`, section B054
- Route : `/care (espace proche malade)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Se confier À Présence, ou à une ligne d'écoute pour les aidants » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Si vous n'en pouvez plus Les signes, et comment souffler » → écran B055 · Proche malade · l'épuisement (`/care/epuisement`)
  - « Respirer, dormir Trois minutes, ou plus » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Écrire Ce que vous n'osez pas lui dire » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Trouver un psychologue Spécialisé dans l'accompagnement » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Prendre soin
de vous aussi.
On s'oublie vite quand on accompagne. Commencez par ce qui demande le moins d'effort.
Maintenant —
Se confier
À Présence, ou à une ligne d'écoute pour les aidants
Si vous n'en pouvez plus
Les signes, et comment souffler
Respirer, dormir
Trois minutes, ou plus
Écrire
Ce que vous n'osez pas lui dire
Trouver un psychologue
Spécialisé dans l'accompagnement
```

### B055 · Proche malade · l'épuisement

- Capture (jointe au message) : `B055-malade-epuisement.png` · Maquette : `maquettes.html`, section B055
- Route : `/care/epuisement` · **à créer**
- Ce qu'on peut toucher :
  - « Soutien » → écran B054 · Proche malade · Soutien (`/care (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Organiser un relais » → écran B052 · Proche malade · qui fait quoi (`/home/equipe`)
  - « Vos droits d'aidant » → écran B056 · Proche malade · Aides (`/practical (espace proche malade)`)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Si vous
n'en pouvez plus.
Fatigue, irritabilité, sommeil difficile, envie de tout lâcher : ce sont des signes d'épuisement. Ce n'est pas un échec.
Ce qui aide —
1
Demandez un relais à un proche, même pour une demi-journée.
2
Renseignez-vous sur l'accueil de jour ou le répit à domicile.
3
Parlez-en à votre médecin : l'épuisement se soigne aussi.
Organiser un relais
Vos droits d'aidant
```

### B056 · Proche malade · Aides

- Capture (jointe au message) : `B056-malade-aides.png` · Maquette : `maquettes.html`, section B056
- Route : `/practical (espace proche malade)` · **à créer** · Onglet « Aides »
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 Le congé de proche aidant Arrêter ou réduire votre travail » → écran B057 · Proche malade · congé de proche aidant (`/practical/conge-aidant`)
  - « 2 L'allocation journalière Une aide pendant ce congé » → écran B058 · Proche malade · l'allocation journalière (`/practical/ajpa`)
  - « 3 Une aide à domicile Pour elle, et pour vous soulager » → écran B059 · Proche malade · une aide à domicile (`/practical/aide-domicile`)
  - « 4 Ses volontés et sa personne de confiance À préparer ensemble, sans urgence » → écran B060 · Proche malade · ses volontés (`/practical/wishes (espace proche malade)`)
- Texte de l'écran, dans l'ordre :

```text
Aides
Besoin d'aide
Ce qui peut
vous aider.
Vos droits d'aidant, et ce qu'il vaut mieux préparer avec elle pendant qu'il est temps.
Pour vous —
1
Le congé de proche aidant
Arrêter ou réduire votre travail
2
L'allocation journalière
Une aide pendant ce congé
3
Une aide à domicile
Pour elle, et pour vous soulager
Avec elle —
4
Ses volontés et sa personne de confiance
À préparer ensemble, sans urgence
```

### B057 · Proche malade · congé de proche aidant

- Capture (jointe au message) : `B057-malade-conge.png` · Maquette : `maquettes.html`, section B057
- Route : `/practical/conge-aidant` · **à créer**
- Ce qu'on peut toucher :
  - « Aides » → écran B056 · Proche malade · Aides (`/practical (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Préparer la lettre à l'employeur » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Aides
Besoin d'aide
POUR LES SALARIÉS
Le congé
de proche aidant.
DURÉE
Jusqu'à 3 mois, renouvelable
AU TOTAL
1 an au plus sur la carrière
REVENU
Allocation versée par la CAF ou la MSA
Les étapes · 0 sur 3 —
Prévenir votre employeur, en général un mois avant
Joindre un justificatif de sa situation
Demander l'allocation à la CAF ou à la MSA
Préparer la lettre à l'employeur
```

### B058 · Proche malade · l'allocation journalière

- Capture (jointe au message) : `B058-malade-allocation.png` · Maquette : `maquettes.html`, section B058
- Route : `/practical/ajpa` · **à créer**
- Ce qu'on peut toucher :
  - « Aides » → écran B056 · Proche malade · Aides (`/practical (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Faire la demande en ligne » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Aides
Besoin d'aide
L'allocation
journalière.
Elle compense en partie le salaire que vous ne touchez pas pendant le congé de proche aidant.
VERSÉE PAR
La CAF, ou la MSA
QUAND
Pour chaque jour de congé
LIMITE
Un nombre de jours sur toute la carrière
Faire la demande en ligne
```

### B059 · Proche malade · une aide à domicile

- Capture (jointe au message) : `B059-malade-aide-domicile.png` · Maquette : `maquettes.html`, section B059
- Route : `/practical/aide-domicile` · **à créer**
- Ce qu'on peut toucher :
  - « Aides » → écran B056 · Proche malade · Aides (`/practical (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Aides
Besoin d'aide
Une aide
à domicile.
Pour qu'elle soit aidée chez elle, et pour vous soulager.
Les pistes —
1
Le centre communal d'action sociale de sa commune : il oriente vers les services d'aide.
2
Si elle a plus de 60 ans : l'allocation personnalisée d'autonomie, demandée au département.
3
Avec son médecin : des soins à domicile, ou l'hospitalisation à domicile.
```

### B060 · Proche malade · ses volontés

- Capture (jointe au message) : `B060-malade-volontes.png` · Maquette : `maquettes.html`, section B060
- Route : `/practical/wishes (espace proche malade)` · **existe**
- Ce qu'on peut toucher :
  - « Aides » → écran B056 · Proche malade · Aides (`/practical (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 Sa personne de confiance Celle que les médecins consulteront si elle ne peut plus s'exprimer » → écran B061 · Proche malade · sa personne de confiance (`/practical/wishes/confiance`)
  - « 2 Ses directives anticipées Ce qu'elle souhaite, ou non, pour la fin de sa vie » → écran B062 · Proche malade · ses directives anticipées (`/practical/wishes/directives`)
  - « 3 Ses souhaits pour après Obsèques, messages, objets » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Comment ouvrir la conversation » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Aides
Besoin d'aide
Ses volontés,
pendant qu'il est temps.
Ce n'est pas renoncer. C'est lui permettre de décider, et vous éviter d'avoir à deviner.
1
Sa personne de confiance
Celle que les médecins consulteront si elle ne peut plus s'exprimer
2
Ses directives anticipées
Ce qu'elle souhaite, ou non, pour la fin de sa vie
3
Ses souhaits pour après
Obsèques, messages, objets
Vous ne savez pas comment en parler avec elle ? Legato vous propose des mots pour commencer.
Comment ouvrir la conversation
```

### B061 · Proche malade · sa personne de confiance

- Capture (jointe au message) : `B061-malade-confiance.png` · Maquette : `maquettes.html`, section B061
- Route : `/practical/wishes/confiance` · **à créer**
- Ce qu'on peut toucher :
  - « Ses volontés » → écran B060 · Proche malade · ses volontés (`/practical/wishes (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Préparer le document » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Ses volontés
Besoin d'aide
Sa personne
de confiance.
Elle peut l'accompagner aux rendez-vous. Si un jour elle ne peut plus s'exprimer, c'est elle que les médecins consulteront.
QUI
Celle qu'elle choisit : vous, ou un autre proche
COMMENT
Par écrit, signé par elle
CHANGEABLE
À tout moment
Préparer le document
```

### B062 · Proche malade · ses directives anticipées

- Capture (jointe au message) : `B062-malade-directives.png` · Maquette : `maquettes.html`, section B062
- Route : `/practical/wishes/directives` · **à créer**
- Ce qu'on peut toucher :
  - « Ses volontés » → écran B060 · Proche malade · ses volontés (`/practical/wishes (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir des phrases » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Ses volontés
Besoin d'aide
Ses directives
anticipées.
Ce qu'elle souhaite, ou non, pour la fin de sa vie. C'est à elle de les écrire ; vous pouvez l'aider.
VALABLES
Sans limite de durée
MODIFIABLES
À tout moment
À GARDER
Chez elle, chez son médecin
Pour en parler avec elle —
Des mots pour commencer
Sans urgence, quand elle est prête.
Voir des phrases
```

### B063 · Proche malade · Souvenirs

- Capture (jointe au message) : `B063-malade-souvenirs.png` · Maquette : `maquettes.html`, section B063
- Route : `/care/garden/space (espace proche malade)` · **à créer** · Onglet « Souvenirs »
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Enregistrer » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ses histoires Ce qu'elle aime raconter » → écran B064 · Proche malade · ses histoires (`/care/garden/histoires`)
  - « Ses recettes Notées avec elle » → écran B065 · Proche malade · ses recettes (`/care/garden/recettes`)
  - « Vos photos ensemble Celles d'avant, celles de maintenant » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Souvenirs
Besoin d'aide
Des moments
à garder.
Pendant qu'elle est là : sa voix, ses histoires, vos photos ensemble.
Une idée pour cette semaine —
Enregistrer sa voix
Lui demander de raconter un souvenir d'enfance · 5 minutes
Enregistrer
Ses histoires
Ce qu'elle aime raconter
Ses recettes
Notées avec elle
Vos photos ensemble
Celles d'avant, celles de maintenant
```

### B064 · Proche malade · ses histoires

- Capture (jointe au message) : `B064-malade-histoires.png` · Maquette : `maquettes.html`, section B064
- Route : `/care/garden/histoires` · **à créer**
- Ce qu'on peut toucher :
  - « Souvenirs » → écran B063 · Proche malade · Souvenirs (`/care/garden/space (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Enregistrer » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Son enfance à Toulon enregistré le 2 octobre · 6 min » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Le voyage en Italie enregistré le 28 septembre · 4 min » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Souvenirs
Besoin d'aide
Ses histoires.
Enregistrez-la quand elle raconte. Legato vous propose une question pour lancer la conversation.
Question du jour —
Comment as-tu rencontré papa ?
Cinq minutes suffisent
Enregistrer
Son enfance à Toulon
enregistré le 2 octobre · 6 min
Le voyage en Italie
enregistré le 28 septembre · 4 min
```

### B065 · Proche malade · ses recettes

- Capture (jointe au message) : `B065-malade-recettes.png` · Maquette : `maquettes.html`, section B065
- Route : `/care/garden/recettes` · **à créer**
- Ce qu'on peut toucher :
  - « Souvenirs » → écran B063 · Proche malade · Souvenirs (`/care/garden/space (espace proche malade)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Le clafoutis aux cerises « Beaucoup de beurre, et pas de noyaux enlevés » » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « La soupe au pistou Notée en août » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ajouter une recette » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Souvenirs
Besoin d'aide
Ses recettes.
Notées avec elle, avec ses mots à elle. Une photo du plat, si vous le cuisinez ensemble.
Le clafoutis aux cerises
« Beaucoup de beurre, et pas de noyaux enlevés »
La soupe au pistou
Notée en août
Ajouter une recette
```

### B066 · Proche malade · Communauté

- Capture (jointe au message) : `B066-malade-communaute.png` · Maquette : `maquettes.html`, section B066
- Route : `/care/community (espace proche malade)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Aidants d'un parent malade 57 membres · très actif » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Soins palliatifs 29 membres · avec une psychologue » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Concilier travail et aidance 33 membres » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir la veillée » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Communauté
Besoin d'aide
Parler avec
d'autres aidants.
Des personnes qui accompagnent, elles aussi, un proche malade. Groupes modérés.
Groupes conseillés —
Aidants d'un parent malade
57 membres · très actif
Soins palliatifs
29 membres · avec une psychologue
Concilier travail et aidance
33 membres
Prochaine veillée —
JEUDI · 20 H
Tenir quand on accompagne
Voir la veillée
```

### B067 · Proche malade · si elle est décédée

- Capture (jointe au message) : `B067-malade-transition.png` · Maquette : `maquettes.html`, section B067
- Route : `/space/settings/transition` · **à créer**
- Ce qu'on peut toucher :
  - « Réglages de l'espace » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Transformer l'espace » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Plus tard » → écran B047 · Proche malade · Aujourd'hui (`/home (espace proche malade)`)
- Texte de l'écran, dans l'ordre :

```text
Réglages de l'espace
Besoin d'aide
Si Maman
est décédée.
Nous sommes désolés. Quand vous serez prêt, cet espace peut devenir un espace de deuil : soutien, démarches après le décès, mémoire.
Ce qui sera gardé —
Le carnet, vos notes, ses volontés, les souvenirs et votre cercle.
Transformer l'espace
Plus tard
```


---

## Parcours « je pense beaucoup à la mort » (1/2) : première ouverture, Aujourd'hui, Soutien

### B068 · Penser à la mort · 1 pour qui

- Capture (jointe au message) : `B068-mort-onb-1.png` · Maquette : `maquettes.html`, section B068
- Route : `/onboarding · étape 1` · **existe** · Choix « Moi : je pense souvent à la mort »
- Ce qu'on peut toucher :
  - « Continuer » → écran B069 · Penser à la mort · 2 ce qui vous occupe (`/onboarding · étape 2`)
- Texte de l'écran, dans l'ordre :

```text
Pour qui créez-vous
cet espace ?
Choisissez la situation la plus proche.
Une personne qui est décédée
Un animal qui est mort
Un proche gravement malade
Moi : je pense souvent à la mort
Comprendre, en parler, préparer
Continuer
```

### B069 · Penser à la mort · 2 ce qui vous occupe

- Capture (jointe au message) : `B069-mort-onb-2.png` · Maquette : `maquettes.html`, section B069
- Route : `/onboarding · étape 2` · **existe**
- Ce qu'on peut toucher :
  - « Continuer » → écran B070 · Penser à la mort · 3 en ce moment (`/onboarding · étape 3`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Qu'est-ce qui vous occupe
le plus ?
Plusieurs choix possibles.
La peur de mourir
La peur de perdre mes proches
Ce qui se passera pour eux après moi
Préparer mes volontés et mes papiers
Le sens de tout cela
Continuer
Passer cette étape
```

### B070 · Penser à la mort · 3 en ce moment

- Capture (jointe au message) : `B070-mort-onb-3.png` · Maquette : `maquettes.html`, section B070
- Route : `/onboarding · étape 3` · **existe** · Sécurité
- Ce qu'on peut toucher :
  - « Continuer » → écran B071 · Penser à la mort · c'est prêt (`/onboarding · fin`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Ces pensées, en ce moment,
c'est plutôt…
Votre réponse reste privée. Elle sert à vous proposer la bonne aide.
Des questions, une inquiétude de fond
Une angoisse qui prend beaucoup de place
Parfois, l'envie de ne plus être là
Legato vous propose tout de suite de parler à quelqu'un
Continuer
Passer cette étape
```

### B071 · Penser à la mort · c'est prêt

- Capture (jointe au message) : `B071-mort-cest-pret.png` · Maquette : `maquettes.html`, section B071
- Route : `/onboarding · fin` · **existe**
- Ce qu'on peut toucher :
  - « Ouvrir mon espace » → écran B072 · Penser à la mort · Aujourd'hui (`/home (espace questions sur la mort)`)
- Texte de l'écran, dans l'ordre :

```text
VOTRE ESPACE EST PRÊT
Votre espace
vous attend.
Voici ce que vous avez choisi. Tout se modifie ensuite dans les réglages de l'espace.
POUR
Vous
EN PREMIER
Apprivoiser l'angoisse
ENSUITE
Préparer, pour vos proches
L'ANGOISSE
Des repères simples
PRÉPARER
À votre rythme
TRANSMETTRE
Lettres, voix, histoire
Ouvrir mon espace
```

### B072 · Penser à la mort · Aujourd'hui

- Capture (jointe au message) : `B072-mort-aujourdhui.png` · Maquette : `maquettes.html`, section B072
- Route : `/home (espace questions sur la mort)` · **à créer** · Remplace l'écran 028
- Ce qu'on peut toucher :
  - « Vos espaces » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Angoisse » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Curiosité » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Tristesse » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Apaisé » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Autre » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Commencer à écrire » → écran B074 · Penser à la mort · écrire ce qui fait peur (`/home/ecrire-peur`)
  - « Préparer 2 sur 6 · votre personne de confiance est choisie » → écran B078 · Penser à la mort · Préparer (`/practical (espace questions)`)
  - « Penser à la mort, ou penser à mourir ? Si les pensées deviennent trop lourdes » → écran B073 · Penser à la mort · penser à mourir ? (`/home/penser-a-mourir`)
- Texte de l'écran, dans l'ordre :

```text
Besoin d'aide
Bonjour Victor. Qu'est-ce qui vous occupe aujourd'hui ?
Angoisse, Curiosité, Tristesse, Apaisé, Autre
Pour aujourd'hui —
Écrire ce qui vous fait peur
10 minutes · parce que l'angoisse est là
Commencer à écrire
Préparer
2 sur 6 · votre personne de confiance est choisie
Penser à la mort, ou penser à mourir ?
Si les pensées deviennent trop lourdes
```

### B073 · Penser à la mort · penser à mourir ?

- Capture (jointe au message) : `B073-mort-penser-a-mourir.png` · Maquette : `maquettes.html`, section B073
- Route : `/home/penser-a-mourir` · **à créer** · Sécurité : 3114
- Ce qu'on peut toucher :
  - « Aujourd'hui » → écran B072 · Penser à la mort · Aujourd'hui (`/home (espace questions sur la mort)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Appeler » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Écrire à Présence Elle vous écoute et vous oriente » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Parler à votre médecin L'angoisse et les idées noires se soignent » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Aujourd'hui
Besoin d'aide
Penser à la mort,
ou penser à mourir ?
Penser souvent à la mort est très humain. Si vous pensez à mettre fin à vos jours, ne restez pas seul avec cette pensée.
3114
Gratuit, jour et nuit
Appeler
Écrire à Présence
Elle vous écoute et vous oriente
Parler à votre médecin
L'angoisse et les idées noires se soignent
```

### B074 · Penser à la mort · écrire ce qui fait peur

- Capture (jointe au message) : `B074-mort-ecrire.png` · Maquette : `maquettes.html`, section B074
- Route : `/home/ecrire-peur` · **à créer**
- Ce qu'on peut toucher :
  - « Aujourd'hui » → écran B072 · Penser à la mort · Aujourd'hui (`/home (espace questions sur la mort)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Garder pour demain » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Dicter plutôt » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Aujourd'hui
Besoin d'aide
Écrire ce qui
vous fait peur.
Personne ne le lira. Le relire demain aide souvent à le voir autrement.
Ce qui me fait peur, c'est…
Garder pour demain
Dicter plutôt
```

### B075 · Penser à la mort · Soutien

- Capture (jointe au message) : `B075-mort-soutien.png` · Maquette : `maquettes.html`, section B075
- Route : `/care (espace questions)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Quand l'angoisse monte Trois gestes simples » → écran B076 · Penser à la mort · l'angoisse (`/care/angoisse`)
  - « En parler À Présence, ou à un psychologue » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ce que d'autres en ont dit Philosophes, soignants, cinéastes » → écran B077 · Penser à la mort · ce que d'autres en ont dit (`/care/resources (espace questions)`)
  - « Écrire Ce qui vous fait peur, ce qui compte » → écran B074 · Penser à la mort · écrire ce qui fait peur (`/home/ecrire-peur`)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Apprivoiser
l'angoisse.
La peur de la mort touche presque tout le monde. Elle peut s'apaiser.
Maintenant —
Quand l'angoisse monte
Trois gestes simples
En parler
À Présence, ou à un psychologue
Ce que d'autres en ont dit
Philosophes, soignants, cinéastes
Écrire
Ce qui vous fait peur, ce qui compte
```

### B076 · Penser à la mort · l'angoisse

- Capture (jointe au message) : `B076-mort-angoisse.png` · Maquette : `maquettes.html`, section B076
- Route : `/care/angoisse` · **à créer**
- Ce qu'on peut toucher :
  - « Soutien » → écran B075 · Penser à la mort · Soutien (`/care (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Respirer trois minutes » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Quand l'angoisse
monte.
Elle arrive souvent le soir. Elle passe toujours.
Ce qui aide —
1
Nommez-la : « c'est de l'angoisse, elle va redescendre ».
2
Inspirez quatre secondes, expirez six.
3
Si elle revient souvent, parlez-en à un médecin : elle se soigne.
Respirer trois minutes
```

### B077 · Penser à la mort · ce que d'autres en ont dit

- Capture (jointe au message) : `B077-mort-lire.png` · Maquette : `maquettes.html`, section B077
- Route : `/care/resources (espace questions)` · **à créer**
- Ce qu'on peut toucher :
  - « Soutien » → écran B075 · Penser à la mort · Soutien (`/care (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « LIRE · ANTIQUITÉ Lettre à Ménécée Épicure » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « LIRE · XVIE SIÈCLE Que philosopher, c'est apprendre à mourir Montaigne, dans les Essais » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « LIRE · TÉMOIGNAGE La Mort intime Marie de Hennezel » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « VOIR · DOCUMENTAIRE, 2020 Dick Johnson Is Dead Kirsten Johnson » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Demander d'autres idées à Présence » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Ce que d'autres
en ont dit.
LIRE · ANTIQUITÉ
Lettre à Ménécée
Épicure
LIRE · XVIE SIÈCLE
Que philosopher, c'est apprendre à mourir
Montaigne, dans les Essais
LIRE · TÉMOIGNAGE
La Mort intime
Marie de Hennezel
VOIR · DOCUMENTAIRE, 2020
Dick Johnson Is Dead
Kirsten Johnson
Demander d'autres idées à Présence
```


---

## Parcours « je pense beaucoup à la mort » (2/2) : Préparer, Transmettre, Communauté

### B078 · Penser à la mort · Préparer

- Capture (jointe au message) : `B078-mort-preparer.png` · Maquette : `maquettes.html`, section B078
- Route : `/practical (espace questions)` · **à créer** · Onglet « Préparer »
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 Mes souhaits pour mes obsèques Cérémonie, musique, lieu FAIT » → écran B079 · Penser à la mort · mes souhaits pour mes obsèques (`/practical/obseques`)
  - « 2 Ma personne de confiance Celle que les médecins consulteront FAIT » → écran B080 · Penser à la mort · ma personne de confiance (`/practical/confiance`)
  - « 3 Mes directives anticipées Pour ma fin de vie » → écran B081 · Penser à la mort · mes directives anticipées (`/practical/directives`)
  - « 4 Le don d'organes Dire mon choix » → écran B082 · Penser à la mort · le don d'organes (`/practical/don-organes`)
  - « 5 Mon testament Seul ou avec un notaire » → écran B083 · Penser à la mort · mon testament (`/practical/testament`)
  - « 6 Un contrat obsèques Ne rien laisser à payer » → écran B084 · Penser à la mort · un contrat obsèques (`/practical/contrat-obseques`)
- Texte de l'écran, dans l'ordre :

```text
Préparer
Besoin d'aide
Préparer,
pour être tranquille.
2/6
PRÊTS
1
Mes souhaits pour mes obsèques
Cérémonie, musique, lieu
FAIT
2
Ma personne de confiance
Celle que les médecins consulteront
FAIT
3
Mes directives anticipées
Pour ma fin de vie
4
Le don d'organes
Dire mon choix
5
Mon testament
Seul ou avec un notaire
6
Un contrat obsèques
Ne rien laisser à payer
```

### B079 · Penser à la mort · mes souhaits pour mes obsèques

- Capture (jointe au message) : `B079-mort-obseques.png` · Maquette : `maquettes.html`, section B079
- Route : `/practical/obseques` · **à créer**
- Ce qu'on peut toucher :
  - « Préparer » → écran B078 · Penser à la mort · Préparer (`/practical (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Modifier » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Préparer
Besoin d'aide
Mes souhaits
pour mes obsèques.
Préparés le 2 octobre. Vous pouvez les changer à tout moment.
CHOIX
Crémation
CÉRÉMONIE
Laïque, en petit comité
MUSIQUE
Un morceau de Bach
LES CENDRES
Dispersées en mer
Qui les connaît —
Claire, votre sœur
Elle les recevra le moment venu.
Modifier
```

### B080 · Penser à la mort · ma personne de confiance

- Capture (jointe au message) : `B080-mort-confiance.png` · Maquette : `maquettes.html`, section B080
- Route : `/practical/confiance` · **à créer**
- Ce qu'on peut toucher :
  - « Préparer » → écran B078 · Penser à la mort · Préparer (`/practical (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Préparer le document à signer » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Préparer
Besoin d'aide
Ma personne
de confiance.
Elle peut vous accompagner chez le médecin. Si un jour vous ne pouvez plus vous exprimer, c'est elle que l'équipe médicale consultera.
CHOISIE
Claire, votre sœur
COMMENT
Par écrit, signé par vous deux
CHANGEABLE
À tout moment
Préparer le document à signer
```

### B081 · Penser à la mort · mes directives anticipées

- Capture (jointe au message) : `B081-mort-directives.png` · Maquette : `maquettes.html`, section B081
- Route : `/practical/directives` · **à créer**
- Ce qu'on peut toucher :
  - « Préparer » → écran B078 · Penser à la mort · Préparer (`/practical (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Les rédiger avec le modèle officiel » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « En parler d'abord avec mon médecin » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Préparer
Besoin d'aide
Mes directives
anticipées.
Ce que vous souhaitez, ou non, pour la fin de votre vie, au cas où vous ne pourriez plus le dire. Les médecins doivent les respecter.
VALABLES
Sans limite de durée
MODIFIABLES
À tout moment
OÙ LES GARDER
Chez vous, chez votre médecin, ou dans Mon espace santé
Les rédiger avec le modèle officiel
En parler d'abord avec mon médecin
```

### B082 · Penser à la mort · le don d'organes

- Capture (jointe au message) : `B082-mort-don.png` · Maquette : `maquettes.html`, section B082
- Route : `/practical/don-organes` · **à créer**
- Ce qu'on peut toucher :
  - « Préparer » → écran B078 · Penser à la mort · Préparer (`/practical (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Écrire un mot à mes proches » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Préparer
Besoin d'aide
Le don
d'organes.
En France, chacun est considéré comme donneur, sauf s'il a exprimé son refus.
Selon votre choix —
1
Vous êtes d'accord : dites-le à vos proches, ils seront consultés.
2
Vous refusez : inscrivez-vous sur le registre national des refus.
3
Vous hésitez : prenez le temps, vous pourrez changer d'avis.
Écrire un mot à mes proches
```

### B083 · Penser à la mort · mon testament

- Capture (jointe au message) : `B083-mort-testament.png` · Maquette : `maquettes.html`, section B083
- Route : `/practical/testament` · **à créer**
- Ce qu'on peut toucher :
  - « Préparer » → écran B078 · Penser à la mort · Préparer (`/practical (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Trouver un notaire » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ce qu'il faut savoir avant » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Préparer
Besoin d'aide
Mon testament.
Il dit à qui vont vos biens et vos objets. Sans testament, c'est la loi qui décide.
Deux façons de faire —
1
Seul : écrit en entier à la main, daté et signé. Gratuit, mais il faut qu'on le retrouve.
2
Avec un notaire : il le conserve et l'enregistre, pour qu'il soit retrouvé.
Trouver un notaire
Ce qu'il faut savoir avant
```

### B084 · Penser à la mort · un contrat obsèques

- Capture (jointe au message) : `B084-mort-contrat.png` · Maquette : `maquettes.html`, section B084
- Route : `/practical/contrat-obseques` · **à créer**
- Ce qu'on peut toucher :
  - « Préparer » → écran B078 · Penser à la mort · Préparer (`/practical (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Préparer
Besoin d'aide
Un contrat
obsèques.
Une assurance qui paie vos obsèques le moment venu, pour que vos proches n'aient rien à avancer.
Deux formules —
1
En capital : une somme est versée à la personne que vous choisissez.
2
En prestations : vous choisissez à l'avance les pompes funèbres et le déroulé.
Avant de signer —
Comparer plusieurs offres
Vous pouvez y renoncer dans les 30 jours.
```

### B085 · Penser à la mort · Transmettre

- Capture (jointe au message) : `B085-mort-transmettre.png` · Maquette : `maquettes.html`, section B085
- Route : `/care/garden/space (espace questions)` · **à créer** · Onglet « Transmettre »
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Commencer » → écran B086 · Penser à la mort · raconter votre vie (`/care/garden/histoire`)
  - « Des lettres pour plus tard À ouvrir à une date choisie » → écran B087 · Penser à la mort · lettres pour plus tard (`/care/garden/lettres`)
  - « Vos objets À qui vous aimeriez les confier » → écran B088 · Penser à la mort · vos objets (`/care/garden/objets`)
- Texte de l'écran, dans l'ordre :

```text
Transmettre
Besoin d'aide
Ce que vous voulez
laisser.
Pour ceux que vous aimez, à votre rythme.
Pour commencer —
Raconter votre vie, question par question
Présence vous pose une question à la fois · 10 minutes
Commencer
Des lettres pour plus tard
À ouvrir à une date choisie
Vos objets
À qui vous aimeriez les confier
```

### B086 · Penser à la mort · raconter votre vie

- Capture (jointe au message) : `B086-mort-histoire.png` · Maquette : `maquettes.html`, section B086
- Route : `/care/garden/histoire` · **à créer**
- Ce qu'on peut toucher :
  - « Transmettre » → écran B085 · Penser à la mort · Transmettre (`/care/garden/space (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Question suivante » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Passer cette question » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Transmettre
Besoin d'aide
QUESTION 3 SUR 12
Quel est votre
premier souvenir ?
Écrivez ou dictez, autant que vous voulez.
La maison de ma grand-mère, l'odeur du café le matin…
Question suivante
Passer cette question
```

### B087 · Penser à la mort · lettres pour plus tard

- Capture (jointe au message) : `B087-mort-lettres.png` · Maquette : `maquettes.html`, section B087
- Route : `/care/garden/lettres` · **à créer**
- Ce qu'on peut toucher :
  - « Transmettre » → écran B085 · Penser à la mort · Transmettre (`/care/garden/space (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Écrire une lettre » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Transmettre
Besoin d'aide
Des lettres
pour plus tard.
Elles restent fermées jusqu'à la date choisie, ou jusqu'à ce qu'un proche les reçoive.
Pour Claire
À OUVRIR À MES 70 ANS
Pour mes neveux
À OUVRIR À LEURS 18 ANS
Pour tous
À OUVRIR QUAND JE NE SERAI PLUS LÀ
Écrire une lettre
```

### B088 · Penser à la mort · vos objets

- Capture (jointe au message) : `B088-mort-objets.png` · Maquette : `maquettes.html`, section B088
- Route : `/care/garden/objets` · **à créer**
- Ce qu'on peut toucher :
  - « Transmettre » → écran B085 · Penser à la mort · Transmettre (`/care/garden/space (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ajouter un objet » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Faire un testament » → écran B083 · Penser à la mort · mon testament (`/practical/testament`)
- Texte de l'écran, dans l'ordre :

```text
Transmettre
Besoin d'aide
Vos objets,
et à qui les confier.
Une simple liste pour vos proches. Elle n'a pas la valeur d'un testament.
LA MONTRE
Pour Paul
LES CARNETS
Pour Claire
LE PIANO
À décider
Ajouter un objet
Faire un testament
```

### B089 · Penser à la mort · Communauté

- Capture (jointe au message) : `B089-mort-communaute.png` · Maquette : `maquettes.html`, section B089
- Route : `/care/community (espace questions)` · **à créer**
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Parler de la mort, simplement 82 membres » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Apprivoiser l'angoisse 34 membres · avec une psychologue » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir le café mortel » → écran B090 · Penser à la mort · café mortel (`/care/community/cafe-mortel`)
- Texte de l'écran, dans l'ordre :

```text
Communauté
Besoin d'aide
En parler,
sans tabou.
Des personnes qui se posent les mêmes questions. Groupes modérés.
Groupes —
Parler de la mort, simplement
82 membres
Apprivoiser l'angoisse
34 membres · avec une psychologue
Café mortel · jeudi 19 h —
Une heure pour parler de la mort, autour d'un café
En visio · huit personnes · une animatrice
Voir le café mortel
```

### B090 · Penser à la mort · café mortel

- Capture (jointe au message) : `B090-mort-cafe-mortel.png` · Maquette : `maquettes.html`, section B090
- Route : `/care/community/cafe-mortel` · **à créer**
- Ce qu'on peut toucher :
  - « Communauté » → écran B089 · Penser à la mort · Communauté (`/care/community (espace questions)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « S'inscrire » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Communauté
Besoin d'aide
Un café
mortel.
Né en Suisse, ce rendez-vous existe aujourd'hui dans le monde entier : on parle de la mort librement, sans thème imposé.
QUAND
Jeudi 9 octobre, 19 h
OÙ
En visio, caméra facultative
AVEC
Huit personnes et une animatrice
S'inscrire
3 PLACES RESTANTES
```


---

## Rituels : accueil, gestes, à plusieurs

### B091 · Rituels · accueil

- Capture (jointe au message) : `B091-rituels.png` · Maquette : `maquettes.html`, section B091
- Route : `/care/rituels` · **existe** · Remplace l'écran 090
- Ce qu'on peut toucher :
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 Un geste, maintenant Seul, en quelques minutes · 8 rituels ↗ » → écran B092 · Rituels · un geste, maintenant (`/care/rituels/maintenant`)
  - « 2 Un rituel à plusieurs Repas, veillée, cercle de parole · 6 rituels ↗ » → écran B093 · Rituels · à plusieurs (`/care/rituels/ensemble`)
  - « 3 Les rituels du monde 21 traditions, du Japon à Madagascar ↗ » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « 4 Le calendrier des jours des morts Prochain : la Toussaint, le 1er novembre ↗ » → écran B111 · Rituels · calendrier (`/care/rituels/calendrier`)
  - « 5 Vos rituels 1 prévu · 2 déjà faits ↗ » → écran B101 · Rituels · vos rituels (`/care/rituels/mes-rituels`)
  - « Vous ne savez pas lequel choisir ? Présence vous en propose trois » → écran B095 · Rituels · propositions de Présence (`/care/rituels/propositions`)
- Texte de l'écran, dans l'ordre :

```text
Mémoire
Besoin d'aide
Des rituels
pour lui rendre hommage.
Choisissez par où commencer.
1
Un geste, maintenant
Seul, en quelques minutes · 8 rituels
↗
2
Un rituel à plusieurs
Repas, veillée, cercle de parole · 6 rituels
↗
3
Les rituels du monde
21 traditions, du Japon à Madagascar
↗
4
Le calendrier des jours des morts
Prochain : la Toussaint, le 1er novembre
↗
5
Vos rituels
1 prévu · 2 déjà faits
↗
Vous ne savez pas lequel choisir ? Présence vous en propose trois
```

### B092 · Rituels · un geste, maintenant

- Capture (jointe au message) : `B092-rituels-maintenant.png` · Maquette : `maquettes.html`, section B092
- Route : `/care/rituels/maintenant` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Allumer une bougie Partout 5 MIN » → écran B102 · Rituels · le geste est fait (`/care/rituels/fait`)
  - « Une lanterne sur l'eau Japon · fête d'Obon 10 MIN » → écran B096 · Rituels · fiche d'un rituel (`/care/rituels/$id`)
  - « Écrire une lettre, puis la laisser partir Partout 20 MIN » → écran B097 · Rituels · la lettre (plein écran) (`/care/rituels/lettre`)
  - « Déposer une petite pierre Tradition juive 2 MIN » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Allumer un bâton d'encens Asie bouddhiste 5 MIN » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Dire son prénom à voix haute Mexique 1 MIN » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Une minute de silence Partout 1 MIN » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Un geste,
maintenant.
Seul, en quelques minutes. Touchez un rituel pour savoir d'où il vient et comment le faire.
Allumer une bougie
Partout
5 MIN
Une lanterne sur l'eau
Japon · fête d'Obon
10 MIN
Écrire une lettre, puis la laisser partir
Partout
20 MIN
Déposer une petite pierre
Tradition juive
2 MIN
Allumer un bâton d'encens
Asie bouddhiste
5 MIN
Dire son prénom à voix haute
Mexique
1 MIN
Une minute de silence
Partout
1 MIN
```

### B093 · Rituels · à plusieurs

- Capture (jointe au message) : `B093-rituels-ensemble.png` · Maquette : `maquettes.html`, section B093
- Route : `/care/rituels/ensemble` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Repas et récits Partout · chacun apporte un plat et un souvenir UNE SOIRÉE » → écran B098 · Rituels · organiser à plusieurs (`/care/rituels/organiser`)
  - « Une veillée en musique Irlande · récits, chansons, et parfois des rires UNE SOIRÉE » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Un cercle de parole Partout · Legato guide le cercle 1 HEURE » → écran B099 · Rituels · cercle de parole (`/care/rituels/cercle`)
  - « Planter un arbre Partout · un geste de mémoire vivante UNE MATINÉE » → écran B100 · Rituels · planter un arbre (`/care/rituels/arbre`)
  - « Une table d'offrandes Corée, Chine · un repas pour ceux qui sont partis UN REPAS » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Organiser un rituel » → écran B098 · Rituels · organiser à plusieurs (`/care/rituels/organiser`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Un rituel
à plusieurs.
Choisissez un rituel, puis Legato prépare l'invitation pour vos proches.
Repas et récits
Partout · chacun apporte un plat et un souvenir
UNE SOIRÉE
Une veillée en musique
Irlande · récits, chansons, et parfois des rires
UNE SOIRÉE
Un cercle de parole
Partout · Legato guide le cercle
1 HEURE
Planter un arbre
Partout · un geste de mémoire vivante
UNE MATINÉE
Une table d'offrandes
Corée, Chine · un repas pour ceux qui sont partis
UN REPAS
Organiser un rituel
```

### B094 · Rituels · ma tradition

- Capture (jointe au message) : `B094-rituels-tradition.png` · Maquette : `maquettes.html`, section B094
- Route : `/care/rituels/tradition` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Continuer » → écran B095 · Rituels · propositions de Présence (`/care/rituels/propositions`)
  - « Passer cette étape » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Souhaitez-vous des rituels
d'une tradition ?
Pour vous proposer des gestes qui ont du sens pour vous. Plusieurs choix possibles.
Sans religion
Chrétienne
Juive
Musulmane
Bouddhiste ou hindoue
Peu importe, montrez-moi tout
Continuer
Passer cette étape
```

### B095 · Rituels · propositions de Présence

- Capture (jointe au message) : `B095-rituels-propositions.png` · Maquette : `maquettes.html`, section B095
- Route : `/care/rituels/propositions` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir » → écran B098 · Rituels · organiser à plusieurs (`/care/rituels/organiser`)
  - « Voir » → écran B096 · Rituels · fiche d'un rituel (`/care/rituels/$id`)
  - « Voir » → écran B100 · Rituels · planter un arbre (`/care/rituels/arbre`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
PROPOSITIONS DE PRÉSENCE
Trois rituels
pour Anne.
Choisis à partir de ce que vous lui avez dit d'elle. Aucun n'est obligatoire.
Repas et récits
Parce qu'elle aimait réunir la famille autour de la table
UNE SOIRÉE · À PLUSIEURS
Voir
Une lanterne sur l'eau
Parce qu'elle aimait la mer, le soir
10 MINUTES · SEUL
Voir
Planter un arbre
Pour que son jardin continue
UNE MATINÉE · À PLUSIEURS
Voir
```

### B096 · Rituels · fiche d'un rituel

- Capture (jointe au message) : `B096-rituels-fiche.png` · Maquette : `maquettes.html`, section B096
- Route : `/care/rituels/$id` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Le faire maintenant » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Le faire avec des proches » → écran B098 · Rituels · organiser à plusieurs (`/care/rituels/organiser`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
JAPON · SEUL OU À PLUSIEURS · 10 MINUTES
Une lanterne
sur l'eau.
Au Japon, à la fin d'Obon, on pose des lanternes sur l'eau pour accompagner les défunts. Ici, dans l'application, ou dehors avec une bougie et un bol d'eau.
Comment faire —
1
Écrivez-lui quelques mots.
2
Posez la lanterne sur l'eau.
3
Regardez-la s'éloigner, le temps qu'il faut.
Le faire maintenant
Le faire avec des proches
```

### B097 · Rituels · la lettre (plein écran)

- Capture (jointe au message) : `B097-rituels-lettre.png` · Maquette : `maquettes.html`, section B097
- Route : `/care/rituels/lettre` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Fermer × » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Laisser partir la lettre » → écran B102 · Rituels · le geste est fait (`/care/rituels/fait`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Fermer ×
Une lettre,
puis la laisser partir.
Écrivez ce qui n'a pas été dit. Personne ne la lira.
Je voulais te dire…
Laisser partir la lettre
Vous pouvez aussi l'imprimer et la brûler dehors, en sécurité.
```

### B098 · Rituels · organiser à plusieurs

- Capture (jointe au message) : `B098-rituels-organiser.png` · Maquette : `maquettes.html`, section B098
- Route : `/care/rituels/organiser` · **à créer**
- Ce qu'on peut toucher :
  - « Repas et récits » → écran B092 · Rituels · un geste, maintenant (`/care/rituels/maintenant`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Envoyer l'invitation » → écran B101 · Rituels · vos rituels (`/care/rituels/mes-rituels`)
- Texte de l'écran, dans l'ordre :

```text
Repas et récits
Besoin d'aide
Repas et récits,
à plusieurs.
Se réunir pour manger et raconter la personne. Chacun apporte un plat et un souvenir.
QUAND
Samedi 3 octobre, 19 h · son anniversaire
OÙ
Chez Claire
AVEC
Claire, Paul, Jeanne
Le message demandera à chacun d'apporter un plat qu'elle aimait et un souvenir à raconter.
Envoyer l'invitation
```

### B099 · Rituels · cercle de parole

- Capture (jointe au message) : `B099-rituels-cercle.png` · Maquette : `maquettes.html`, section B099
- Route : `/care/rituels/cercle` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Lancer le cercle » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Prévoir une date » → écran B098 · Rituels · organiser à plusieurs (`/care/rituels/organiser`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Un cercle
de parole.
Réunis, chacun partage un souvenir. Legato vous guide pas à pas, pour que personne n'ait à animer.
Comment ça se passe —
1
Chacun parle à son tour, dans l'ordre qu'il veut.
2
Le silence est accepté : on peut passer son tour.
3
On termine ensemble, par une bougie ou une minute de silence.
Lancer le cercle
Prévoir une date
```

### B100 · Rituels · planter un arbre

- Capture (jointe au message) : `B100-rituels-arbre.png` · Maquette : `maquettes.html`, section B100
- Route : `/care/rituels/arbre` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Garder ce projet » → écran B101 · Rituels · vos rituels (`/care/rituels/mes-rituels`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Planter un arbre
pour elle.
Un geste de mémoire vivante, à faire seul ou à plusieurs.
QUAND
Plutôt de novembre à mars
OÙ
Un jardin, ou une forêt partenaire
Choisir l'arbre —
1
Un arbre qu'elle aimait, ou qui vous la rappelle.
2
Un arbre adapté à votre région : demandez conseil à une pépinière.
Garder ce projet
```

### B101 · Rituels · vos rituels

- Capture (jointe au message) : `B101-rituels-mes-rituels.png` · Maquette : `maquettes.html`, section B101
- Route : `/care/rituels/mes-rituels` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Choisir un rituel » → écran B091 · Rituels · accueil (`/care/rituels`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Vos rituels.
À venir —
3
OCT.
Repas et récits
Chez Claire · 4 proches invités
8
SEPT.
Une bougie de 24 heures
Chaque année · rappel la veille
Déjà faits —
21
SEPT.
Une bougie allumée
Avec quelques mots
14
SEPT.
Une lanterne sur l'eau
Seul, le soir
Choisir un rituel
```

### B102 · Rituels · le geste est fait

- Capture (jointe au message) : `B102-rituels-fait.png` · Maquette : `maquettes.html`, section B102
- Route : `/care/rituels/fait` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Ajouter quelques mots » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Le refaire chaque année » → écran B101 · Rituels · vos rituels (`/care/rituels/mes-rituels`)
  - « Revenir à son jardin » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Le geste
est fait.
La bougie restera allumée dans le jardin d'Anne jusqu'à demain matin. Vos proches la verront.
Si vous le souhaitez —
Ajouter quelques mots, ou refaire ce geste chaque année à la même date.
Ajouter quelques mots
Le refaire chaque année
Revenir à son jardin
```


---

## Rituels du monde et calendrier

### B103 · Rituels du monde · les régions

- Capture (jointe au message) : `B103-rituels-monde.png` · Maquette : `maquettes.html`, section B103
- Route : `/care/rituels/monde` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Asie Japon, Chine, Corée, Népal 5 » → écran B104 · Rituels du monde · Asie (`/care/rituels/monde/asie`)
  - « Amériques Mexique, Nouvelle-Orléans, Bolivie, Guatemala 4 » → écran B105 · Rituels du monde · Amériques (`/care/rituels/monde/ameriques`)
  - « Afrique Madagascar, Ghana, Afrique du Sud 4 » → écran B106 · Rituels du monde · Afrique (`/care/rituels/monde/afrique`)
  - « Europe et Moyen-Orient Irlande, France, Grèce, traditions juive et musulmane 5 » → écran B107 · Rituels du monde · Europe et Moyen-Orient (`/care/rituels/monde/europe`)
  - « Océanie Australie, Nouvelle-Zélande 3 » → écran B108 · Rituels du monde · Océanie (`/care/rituels/monde/oceanie`)
  - « D'autres regards sur la mort » → écran B113 · Rituels du monde · d'autres regards (`/care/rituels/regards`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Ailleurs, la mort
se vit autrement.
On danse, on festoie, on parle aux morts, on garde leur place à table. Découvrir ces regards peut aider à vivre le sien.
Asie
Japon, Chine, Corée, Népal
5
Amériques
Mexique, Nouvelle-Orléans, Bolivie, Guatemala
4
Afrique
Madagascar, Ghana, Afrique du Sud
4
Europe et Moyen-Orient
Irlande, France, Grèce, traditions juive et musulmane
5
Océanie
Australie, Nouvelle-Zélande
3
D'autres regards sur la mort
```

### B104 · Rituels du monde · Asie

- Capture (jointe au message) : `B104-rituels-asie.png` · Maquette : `maquettes.html`, section B104
- Route : `/care/rituels/monde/asie` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels du monde » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « JAPON · JUILLET OU AOÛT Obon et les lanternes On accueille les ancêtres trois jours, puis on les raccompagne avec des lanternes posées sur l'eau. » → écran B096 · Rituels · fiche d'un rituel (`/care/rituels/$id`)
  - « CHINE · DÉBUT AVRIL Qingming, la fête de la clarté On nettoie les tombes, on y apporte des fleurs et des plats. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « JAPON · CHAQUE JOUR Le butsudan Un petit autel chez soi : photo, encens, un bol de riz. On salue ses morts le matin. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « NÉPAL · FIN DE L'ÉTÉ Gai Jatra Les familles en deuil défilent dans la rue, en chantant, pour accepter la mort ensemble. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « CORÉE · CHUSEOK, EN AUTOMNE La table des ancêtres On dresse une table d'offrandes et on s'incline devant les ancêtres. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels du monde
Besoin d'aide
Asie : des morts
qui restent proches.
JAPON · JUILLET OU AOÛT
Obon et les lanternes
On accueille les ancêtres trois jours, puis on les raccompagne avec des lanternes posées sur l'eau.
CHINE · DÉBUT AVRIL
Qingming, la fête de la clarté
On nettoie les tombes, on y apporte des fleurs et des plats.
JAPON · CHAQUE JOUR
Le butsudan
Un petit autel chez soi : photo, encens, un bol de riz. On salue ses morts le matin.
NÉPAL · FIN DE L'ÉTÉ
Gai Jatra
Les familles en deuil défilent dans la rue, en chantant, pour accepter la mort ensemble.
CORÉE · CHUSEOK, EN AUTOMNE
La table des ancêtres
On dresse une table d'offrandes et on s'incline devant les ancêtres.
```

### B105 · Rituels du monde · Amériques

- Capture (jointe au message) : `B105-rituels-ameriques.png` · Maquette : `maquettes.html`, section B105
- Route : `/care/rituels/monde/ameriques` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels du monde » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « MEXIQUE · 1ER ET 2 NOVEMBRE Le Jour des morts On dresse un autel avec photos, fleurs orange et plats préférés pour accueillir les morts. » → écran B110 · Rituels du monde · faire une ofrenda (`/care/rituels/monde/ameriques/ofrenda`)
  - « NOUVELLE-ORLÉANS · LORS DES OBSÈQUES Les cortèges de jazz La fanfare joue lentement à l'aller, puis le cortège revient en dansant pour célébrer la vie. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « BOLIVIE · 8 NOVEMBRE Le jour des Ñatitas On fleurit et on remercie des crânes gardés à la maison, vus comme des protecteurs. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « GUATEMALA · 1ER NOVEMBRE Les cerfs-volants géants À Sumpango, on fait voler d'immenses cerfs-volants pour envoyer des messages aux défunts. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels du monde
Besoin d'aide
Amériques : la mort
se fête aussi.
MEXIQUE · 1ER ET 2 NOVEMBRE
Le Jour des morts
On dresse un autel avec photos, fleurs orange et plats préférés pour accueillir les morts.
NOUVELLE-ORLÉANS · LORS DES OBSÈQUES
Les cortèges de jazz
La fanfare joue lentement à l'aller, puis le cortège revient en dansant pour célébrer la vie.
BOLIVIE · 8 NOVEMBRE
Le jour des Ñatitas
On fleurit et on remercie des crânes gardés à la maison, vus comme des protecteurs.
GUATEMALA · 1ER NOVEMBRE
Les cerfs-volants géants
À Sumpango, on fait voler d'immenses cerfs-volants pour envoyer des messages aux défunts.
```

### B106 · Rituels du monde · Afrique

- Capture (jointe au message) : `B106-rituels-afrique.png` · Maquette : `maquettes.html`, section B106
- Route : `/care/rituels/monde/afrique` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels du monde » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « MADAGASCAR · TOUS LES 5 À 7 ANS Le retournement des morts On enveloppe les défunts dans de nouveaux linceuls et on danse avec eux. » → écran B109 · Rituels du monde · une tradition expliquée (`/care/rituels/monde/$region/$id`)
  - « GHANA Les cercueils figuratifs Un cercueil sculpté à l'image d'un métier ou d'une passion : un poisson, un avion… » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « GHANA Des funérailles en couleurs Rouge et noir pour la famille proche, blanc pour célébrer une longue vie. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « AFRIQUE DU SUD · UN AN APRÈS Le dévoilement de la pierre La famille se réunit pour dévoiler la pierre tombale et clore le deuil. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels du monde
Besoin d'aide
Afrique : les morts
restent de la famille.
MADAGASCAR · TOUS LES 5 À 7 ANS
Le retournement des morts
On enveloppe les défunts dans de nouveaux linceuls et on danse avec eux.
GHANA
Les cercueils figuratifs
Un cercueil sculpté à l'image d'un métier ou d'une passion : un poisson, un avion…
GHANA
Des funérailles en couleurs
Rouge et noir pour la famille proche, blanc pour célébrer une longue vie.
AFRIQUE DU SUD · UN AN APRÈS
Le dévoilement de la pierre
La famille se réunit pour dévoiler la pierre tombale et clore le deuil.
```

### B107 · Rituels du monde · Europe et Moyen-Orient

- Capture (jointe au message) : `B107-rituels-europe.png` · Maquette : `maquettes.html`, section B107
- Route : `/care/rituels/monde/europe` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels du monde » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « IRLANDE La veillée irlandaise On veille le défunt à la maison, avec des récits, de la musique, parfois des rires. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « FRANCE · 1ER NOVEMBRE La Toussaint On fleurit les tombes, souvent de chrysanthèmes. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « GRÈCE ET MONDE ORTHODOXE Les quarante jours On partage la kollyva, un blé bouilli au miel, en mémoire du défunt. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « TRADITION JUIVE La shiv'a Sept jours de deuil à la maison, puis chaque année une bougie de 24 heures. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « TRADITION MUSULMANE Les trois jours de condoléances La famille reçoit pendant trois jours ; les proches apportent les repas. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels du monde
Besoin d'aide
Europe et Moyen-Orient :
veiller, recevoir, se souvenir.
IRLANDE
La veillée irlandaise
On veille le défunt à la maison, avec des récits, de la musique, parfois des rires.
FRANCE · 1ER NOVEMBRE
La Toussaint
On fleurit les tombes, souvent de chrysanthèmes.
GRÈCE ET MONDE ORTHODOXE
Les quarante jours
On partage la kollyva, un blé bouilli au miel, en mémoire du défunt.
TRADITION JUIVE
La shiv'a
Sept jours de deuil à la maison, puis chaque année une bougie de 24 heures.
TRADITION MUSULMANE
Les trois jours de condoléances
La famille reçoit pendant trois jours ; les proches apportent les repas.
```

### B108 · Rituels du monde · Océanie

- Capture (jointe au message) : `B108-rituels-oceanie.png` · Maquette : `maquettes.html`, section B108
- Route : `/care/rituels/monde/oceanie` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels du monde » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « PEUPLES ABORIGÈNES D'AUSTRALIE Le Sorry Business Un deuil collectif ; on évite souvent de prononcer le nom du défunt ou de montrer son image. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « MAORIS · NOUVELLE-ZÉLANDE Le tangihanga Plusieurs jours de veillée sur le lieu de rassemblement : le défunt n'est jamais laissé seul. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « NOUVELLE-ZÉLANDE · JUIN OU JUILLET Matariki Au lever des Pléiades, on se souvient de ceux qui sont partis dans l'année. » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels du monde
Besoin d'aide
Océanie : un deuil
partagé par tous.
PEUPLES ABORIGÈNES D'AUSTRALIE
Le Sorry Business
Un deuil collectif ; on évite souvent de prononcer le nom du défunt ou de montrer son image.
MAORIS · NOUVELLE-ZÉLANDE
Le tangihanga
Plusieurs jours de veillée sur le lieu de rassemblement : le défunt n'est jamais laissé seul.
NOUVELLE-ZÉLANDE · JUIN OU JUILLET
Matariki
Au lever des Pléiades, on se souvient de ceux qui sont partis dans l'année.
```

### B109 · Rituels du monde · une tradition expliquée

- Capture (jointe au message) : `B109-rituels-tradition-madagascar.png` · Maquette : `maquettes.html`, section B109
- Route : `/care/rituels/monde/$region/$id` · **à créer** · Modèle pour chaque tradition
- Ce qu'on peut toucher :
  - « Afrique » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Afrique
Besoin d'aide
MADAGASCAR · HAUTS PLATEAUX · TOUS LES 5 À 7 ANS
Le retournement
des morts.
Pendant la Famadihana, la famille ouvre le tombeau, enveloppe ses défunts dans de nouveaux linceuls et danse avec eux, en musique, avant de les remettre en place.
Ce que cela dit de la mort —
Les morts restent des membres de la famille, dont on prend soin.
Ce que l'on peut en garder —
1
Prendre soin de ses morts, régulièrement, comme d'un lien qui continue.
2
Faire de la mémoire une fête, et non seulement un chagrin.
```

### B110 · Rituels du monde · faire une ofrenda

- Capture (jointe au message) : `B110-rituels-ofrenda.png` · Maquette : `maquettes.html`, section B110
- Route : `/care/rituels/monde/ameriques/ofrenda` · **à créer**
- Ce qu'on peut toucher :
  - « Amériques » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Le prévoir pour le 2 novembre » → écran B101 · Rituels · vos rituels (`/care/rituels/mes-rituels`)
- Texte de l'écran, dans l'ordre :

```text
Amériques
Besoin d'aide
MEXIQUE · 1ER ET 2 NOVEMBRE
Faire une ofrenda,
chez vous.
Pour le Jour des morts, on dresse un autel pour accueillir ceux qui sont partis : leur photo, ce qu'ils aimaient, des fleurs orange, des bougies.
Comment faire —
1
Posez sa photo, et un objet qui lui ressemble.
2
Ajoutez ce qu'elle aimait manger ou boire.
3
Allumez une bougie, et dites son prénom à voix haute.
Le prévoir pour le 2 novembre
```

### B111 · Rituels · calendrier

- Capture (jointe au message) : `B111-rituels-calendrier.png` · Maquette : `maquettes.html`, section B111
- Route : `/care/rituels/calendrier` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels » → écran B091 · Rituels · accueil (`/care/rituels`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « J » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « F » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « M » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « A » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « S » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « O » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « N » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « D » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 3 OCT. Son anniversaire Préparer un geste, seul ou à plusieurs VOTRE DATE » → écran B101 · Rituels · vos rituels (`/care/rituels/mes-rituels`)
  - « 31 OCT. Samhain Irlande · on pense à ceux qui sont partis » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 1 NOV. La Toussaint France · on fleurit les tombes » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « 2 NOV. Le Jour des morts Mexique · autels, fleurs orange, plats préférés » → écran B110 · Rituels du monde · faire une ofrenda (`/care/rituels/monde/ameriques/ofrenda`)
  - « 8 NOV. Le jour des Ñatitas Bolivie · des crânes fleuris et remerciés » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Voir toute l'année » → écran B112 · Rituels · toute l'année (`/care/rituels/calendrier/annee`)
- Texte de l'écran, dans l'ordre :

```text
Rituels
Besoin d'aide
Le calendrier
des jours des morts.
Les dates du monde, et les vôtres, au même endroit. Touchez un mois.
J
F
J
J
S
O
N
D
OCTOBRE ET NOVEMBRE
3
OCT.
Son anniversaire
Préparer un geste, seul ou à plusieurs
VOTRE DATE
31
OCT.
Samhain
Irlande · on pense à ceux qui sont partis
1
NOV.
La Toussaint
France · on fleurit les tombes
2
NOV.
Le Jour des morts
Mexique · autels, fleurs orange, plats préférés
8
NOV.
Le jour des Ñatitas
Bolivie · des crânes fleuris et remerciés
Voir toute l'année
```

### B112 · Rituels · toute l'année

- Capture (jointe au message) : `B112-rituels-calendrier-annee.png` · Maquette : `maquettes.html`, section B112
- Route : `/care/rituels/calendrier/annee` · **à créer**
- Ce qu'on peut toucher :
  - « Calendrier » → écran B111 · Rituels · calendrier (`/care/rituels/calendrier`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Calendrier
Besoin d'aide
Toute l'année.
AVRIL
Qingming
Chine
JUIN, JUILLET
Matariki
Nouvelle-Zélande
JUILLET, AOÛT
Obon
Japon
JUILLET À SEPT.
Le retournement des morts
Madagascar
AOÛT
La fête des fantômes
Chine
AOÛT, SEPT.
Gai Jatra
Népal
SEPT., OCT.
Pitru Paksha · Chuseok
Inde · Corée
31 OCT.
Samhain
Irlande
1ER ET 2 NOV.
Toussaint · Jour des morts
France · Mexique
8 NOV.
Le jour des Ñatitas
Bolivie
```

### B113 · Rituels du monde · d'autres regards

- Capture (jointe au message) : `B113-rituels-regards.png` · Maquette : `maquettes.html`, section B113
- Route : `/care/rituels/regards` · **à créer**
- Ce qu'on peut toucher :
  - « Rituels du monde » → écran B103 · Rituels du monde · les régions (`/care/rituels/monde`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Demander à Présence » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Rituels du monde
Besoin d'aide
D'autres regards
sur la mort.
Au Ghana, on enterre dans un cercueil en forme de ce qu'on aimait.
Un poisson pour un pêcheur, un avion pour un voyageur : on célèbre une vie.
À la Nouvelle-Orléans, le cortège part en silence et revient en dansant.
Le jazz accompagne le chagrin, puis la joie d'avoir connu la personne.
En Suède, on range sa maison avant de partir.
Le « döstädning » : trier ses affaires pour alléger ceux qui restent.
Présence peut vous raconter d'autres traditions, d'un pays qui vous parle ou d'où venait Anne.
Demander à Présence
```


---

## Lire, écouter, voir

### B114 · Lire, écouter, voir · Lire

- Capture (jointe au message) : `B114-lire.png` · Maquette : `maquettes.html`, section B114
- Route : `/care/resources` · **existe** · Remplace l'écran 040
- Ce qu'on peut toucher :
  - « Soutien » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Lire » → sélection sur place
  - « Écouter » → écran B115 · Lire, écouter, voir · Écouter (`/care/resources (onglet Écouter)`)
  - « Voir » → écran B116 · Lire, écouter, voir · Voir (`/care/resources (onglet Voir)`)
  - « Gardés » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « LIVRE · RÉCIT L'année de la pensée magique Joan Didion · après la mort de son mari » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « LIVRE · JOURNAL Journal de deuil Roland Barthes · des notes courtes, à lire par morceaux » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « LIVRE · REPÈRES Vivre le deuil au jour le jour Christophe Fauré · ce qui se passe, mois après mois » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Demander à Présence » → écran B118 · Lire, écouter, voir · suggestions de Présence (`/care/resources/suggestions`)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Lire, écouter,
voir.
Choisis pour la perte d'un conjoint.
Lire
Écouter
Voir
Gardés
LIVRE · RÉCIT
L'année de la pensée magique
Joan Didion · après la mort de son mari
LIVRE · JOURNAL
Journal de deuil
Roland Barthes · des notes courtes, à lire par morceaux
LIVRE · REPÈRES
Vivre le deuil au jour le jour
Christophe Fauré · ce qui se passe, mois après mois
Rien ne vous parle ? Dites à Présence ce que vous cherchez : elle vous suggère d'autres livres.
Demander à Présence
```

### B115 · Lire, écouter, voir · Écouter

- Capture (jointe au message) : `B115-ecouter.png` · Maquette : `maquettes.html`, section B115
- Route : `/care/resources (onglet Écouter)` · **existe**
- Ce qu'on peut toucher :
  - « Soutien » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Lire » → écran B114 · Lire, écouter, voir · Lire (`/care/resources`)
  - « Écouter » → sélection sur place
  - « Voir » → écran B116 · Lire, écouter, voir · Voir (`/care/resources (onglet Voir)`)
  - « Gardés » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « PODCAST · TÉMOIGNAGES Les Pieds sur terre France Culture · des récits de vie, sans commentaire » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « PODCAST · EN ANGLAIS Griefcast Cariad Lloyd · parler du deuil, avec humour aussi » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « MUSIQUE Requiem Gabriel Fauré · une heure, doux et lumineux » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Demander à Présence » → écran B118 · Lire, écouter, voir · suggestions de Présence (`/care/resources/suggestions`)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Lire, écouter,
voir.
Choisis pour la perte d'un conjoint.
Lire
Écouter
Voir
Gardés
PODCAST · TÉMOIGNAGES
Les Pieds sur terre
France Culture · des récits de vie, sans commentaire
PODCAST · EN ANGLAIS
Griefcast
Cariad Lloyd · parler du deuil, avec humour aussi
MUSIQUE
Requiem
Gabriel Fauré · une heure, doux et lumineux
Rien ne vous parle ? Dites à Présence ce que vous cherchez : elle vous suggère d'autres podcasts et musiques.
Demander à Présence
```

### B116 · Lire, écouter, voir · Voir

- Capture (jointe au message) : `B116-voir.png` · Maquette : `maquettes.html`, section B116
- Route : `/care/resources (onglet Voir)` · **à créer**
- Ce qu'on peut toucher :
  - « Soutien » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Lire » → écran B114 · Lire, écouter, voir · Lire (`/care/resources`)
  - « Écouter » → écran B115 · Lire, écouter, voir · Écouter (`/care/resources (onglet Écouter)`)
  - « Voir » → sélection sur place
  - « Gardés » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « FILM · JAPON, 2008 Departures Yōjirō Takita · celui qui prépare les défunts » → écran B117 · Lire, écouter, voir · un film (`/library/$kind (détail)`)
  - « FILM · ITALIE, 2001 La Chambre du fils Nanni Moretti · une famille après la perte d'un enfant » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « FILM D'ANIMATION · 2017 Coco Pixar · le Jour des morts au Mexique, à voir en famille » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Demander à Présence » → écran B118 · Lire, écouter, voir · suggestions de Présence (`/care/resources/suggestions`)
- Texte de l'écran, dans l'ordre :

```text
Soutien
Besoin d'aide
Lire, écouter,
voir.
Choisis pour la perte d'un conjoint.
Lire
Écouter
Voir
Gardés
FILM · JAPON, 2008
Departures
Yōjirō Takita · celui qui prépare les défunts
FILM · ITALIE, 2001
La Chambre du fils
Nanni Moretti · une famille après la perte d'un enfant
FILM D'ANIMATION · 2017
Coco
Pixar · le Jour des morts au Mexique, à voir en famille
Rien ne vous parle ? Dites à Présence ce que vous cherchez : elle vous suggère d'autres films, séries et documentaires.
Demander à Présence
```

### B117 · Lire, écouter, voir · un film

- Capture (jointe au message) : `B117-film.png` · Maquette : `maquettes.html`, section B117
- Route : `/library/$kind (détail)` · **existe** · Remplace l'écran 041 pour les films
- Ce qu'on peut toucher :
  - « Voir » → écran B116 · Lire, écouter, voir · Voir (`/care/resources (onglet Voir)`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Garder pour plus tard » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
  - « Où le voir » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Voir
Besoin d'aide
FILM · JAPON · 2008 · 2 H 10
Departures.
Yōjirō Takita
Un violoncelliste devient, presque par hasard, celui qui prépare les défunts avant la cérémonie. Un film doux sur les gestes qu'on accomplit pour ceux qui partent.
POUR QUI
Tous les deuils
MOMENT
Quand vous vous sentez prêt
TON
Grave, mais souvent drôle
Garder pour plus tard
Où le voir
```

### B118 · Lire, écouter, voir · suggestions de Présence

- Capture (jointe au message) : `B118-suggestions.png` · Maquette : `maquettes.html`, section B118
- Route : `/care/resources/suggestions` · **à créer**
- Ce qu'on peut toucher :
  - « Lire, écouter, voir » → écran B114 · Lire, écouter, voir · Lire (`/care/resources`)
  - « Besoin d'aide » → action sur place ou page commune du premier dossier (enregistrer, appeler, ouvrir un groupe, le journal, les photos…)
- Texte de l'écran, dans l'ordre :

```text
Lire, écouter, voir
Besoin d'aide
Que cherchez-vous
en ce moment ?
Un film doux, pas trop triste, sur la perte d'une épouse
CourtQui fait du bienPour un enfantEn anglais
PROPOSITIONS DE PRÉSENCE
FILM · JAPON, 2008
Still Walking
Hirokazu Kore-eda · une famille se souvient d'un fils, autour d'un repas d'été
FILM · ÉTATS-UNIS, 2017
A Ghost Story
David Lowery · l'absence, vue de l'autre côté, presque sans paroles
```
