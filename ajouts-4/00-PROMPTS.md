# Prompts Lovable — ajouts n° 4

À envoyer **après** les messages du premier dossier (`legato-design/00-PROMPTS-LOVABLE.md`) et ceux de `ajouts-2`, un par un, dans l'ordre. **Le dossier `ajouts-3` n'est pas à utiliser : celui-ci le remplace.** Joins à chaque message les captures citées dans son titre ; elles sont dans le dossier `ajouts-4-images` sur ton ordinateur.

---

## Message D0 — Le cadre

```
Le dossier `legato-design/ajouts-4/` ajoute et modifie des écrans par rapport à ce que tu as construit avec `legato-design/` et `legato-design/ajouts-2/`. Ignore `legato-design/ajouts-3/` s'il existe.
Lis :
- `01-REGLES.md` : couleurs, dégradés, mots expliqués, pages réutilisées, « au bon moment », « Je suis bloqué », échéances, coffre, soutien, confidentialité, écrans remplacés, liens officiels ;
- `02-ECRANS.md` : les 122 écrans D001 à D122, avec leur route et leur texte exact ;
- `03-BOUTONS.md` : chaque bouton de l'application et ce qu'il ouvre ;
- `04-PRESENCE.md` : comment Présence écoute et guide ;
- `05-LEXIQUE.md` et le dossier `donnees/` : les contenus à charger tels quels ;
- `maquettes.html` : une section par écran, avec les mesures exactes ; et les plans `plan-*.png` et `degrades.png`.
Mêmes règles de travail qu'avant : la maquette fait foi, tu ne supprimes rien sans me demander, tu gardes l'animation d'ouverture et le jardin peint avec les parcelles, et tu ne construis jamais deux fois le même écran (voir `01-REGLES.md` §4 et §12).
Pour cette première réponse, ne modifie aucun code : résume-moi en 12 lignes ce que tu vas faire, en particulier les pages réutilisées, « au bon moment », la confidentialité et Présence.
```

---

## Message D1 — Règles transverses et corrections (captures D001 à D005 + degrades.png)

```
Étape D1 sur D13 : Règles transverses et corrections. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D001 · Couleurs par espace → — (modifié)
   - D002 · Une conversation → /care/community/groups/$id/fil (modifié)
   - D003 · Rituels · la lettre (plein écran) → /care/rituels/lettre (modifié)
   - D004 · Page réutilisable · les boutons sans page → — (à créer)
   - D005 · Page réutilisable · le mot expliqué → (fenêtre) (à créer)

- Lis `01-REGLES.md` en entier. Applique d'abord §1 (titres de Démarches en vert sur les écrans listés), §2 (dégradés, joins `degrades.png`), §3 (« En clair », lexique), §11 (confidentialité) et la correction du délai des obsèques (§7 : 14 jours).
- Refais « Une conversation » (D002) et construis la fenêtre « Le mot expliqué » (D005) et les trois réponses des boutons sans page (D004).
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D2 — Les pages réutilisées (captures D006 à D013)

```
Étape D2 sur D13 : Les pages réutilisées. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D006 · Page réutilisable · message prêt → /partage/message (à créer)
   - D007 · Page réutilisable · avant d'ouvrir un site officiel → /partage/site-officiel (à créer)
   - D008 · Page réutilisable · un document → /documents/$id (à créer)
   - D009 · Page réutilisable · un dossier de documents → /documents/dossier/$categorie (à créer)
   - D010 · Démarches · prévenir les proches → /practical/prevenir (à créer)
   - D011 · Page réutilisable · un article d'aide → /aide/$article (à créer)
   - D012 · Page réutilisable · confirmer une suppression → /reglages/supprimer (à créer)
   - D013 · Page réutilisable · mot de passe oublié → /auth/mot-de-passe (à créer)

- Construis chaque page réutilisée **une seule fois**, comme composant paramétrable (§4, `donnees/pages-reutilisees.json`). Ne relie pas encore les boutons.
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D3 — Le corps, approfondi (captures D014 à D025 + plan-corps.png)

```
Étape D3 sur D13 : Le corps, approfondi. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D014 · Le corps · sommaire → /help/corps (modifié)
   - D015 · Le corps · 01 · Dormir → /help/corps/dormir (à créer)
   - D016 · Le corps · 02 · Manger → /help/corps/manger (à créer)
   - D017 · Le corps · 03 · Se laver → /help/corps/se-laver (à créer)
   - D018 · Le corps · 04 · S'habiller → /help/corps/s-habiller (à créer)
   - D019 · Le corps · un moment de soin → /help/corps/soin (à créer)
   - D020 · Le corps · exercice du soir (plein écran) → /help/corps/exercice (à créer)
   - D021 · Le corps · bouger un peu → /help/corps/bouger (modifié)
   - D022 · Le corps · marcher avec une voix (plein écran) → /help/corps/marche (à créer)
   - D023 · Le corps · votre petit suivi → /help/corps/suivi (modifié)
   - D024 · Le corps · noter aujourd'hui → /help/corps/noter (à créer)
   - D025 · Le corps · quand consulter → /help/corps/consulter (modifié)

- Joins `plan-corps.png`. Les pages Dormir, Manger, Se laver, S'habiller remplacent celles du premier dossier (§12).
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D4 — Les sons de bien-être (captures D026 à D032 + plan-sons.png)

```
Étape D4 sur D13 : Les sons de bien-être. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D026 · Sons · accueil → /care/sons (à créer)
   - D027 · Sons · pour s'endormir → /care/sons/endormir (à créer)
   - D028 · Sons · le lecteur (plein écran) → /care/sons/lecteur/$id (à créer)
   - D029 · Sons · minuteur → /care/sons/minuteur (à créer)
   - D030 · Sons · composer votre ambiance → /care/sons/melange (à créer)
   - D031 · Sons · voix guidées → /care/sons/voix (à créer)
   - D032 · Sons · vos sons → /care/sons/vos-sons (à créer)

- Joins `plan-sons.png`. Le lecteur et le minuteur fonctionnent écran éteint. Prévois des fichiers audio de démonstration dont Legato a les droits.
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D5 — Mémoire, approfondie (captures D033 à D049 + plan-memoire.png)

```
Étape D5 sur D13 : Mémoire, approfondie. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D033 · Mémoire · le jardin d'Anne → /care/garden/space (modifié)
   - D034 · Mémoire · tous ses souvenirs → /care/garden/souvenirs (à créer)
   - D035 · Mémoire · ses photos → /care/garden/souvenirs?type=photo (à créer)
   - D036 · Mémoire · sa voix → /care/garden/souvenirs?type=voix (à créer)
   - D037 · Mémoire · un souvenir → /care/garden/souvenirs/$id (à créer)
   - D038 · Mémoire · ajouter un souvenir → /care/garden/ajouter (à créer)
   - D039 · Mémoire · ajouter une photo → /care/garden/ajouter/photo (à créer)
   - D040 · Mémoire · ajouter sa voix → /care/garden/ajouter/voix (à créer)
   - D041 · Mémoire · ajouter une phrase, un lieu, un objet, une date → /care/garden/ajouter/$type (à créer)
   - D042 · Mémoire · c'est gardé → /care/garden/ajouter/fait (à créer)
   - D043 · Mémoire · son portrait → /care/garden/portrait (à créer)
   - D044 · Mémoire · avec vos proches → /care/garden/proches (à créer)
   - D045 · Mémoire · les souvenirs de Claire → /care/garden/proches/valider (à créer)
   - D046 · Mémoire · un livre pour elle → /care/garden/livre (à créer)
   - D047 · Mémoire · l'aperçu du livre → /care/garden/livre/apercu (à créer)
   - D048 · Mémoire · commander le livre → /care/garden/livre/commande (à créer)
   - D049 · Mémoire · ses dates → /care/garden/dates (à créer)

- Joins `plan-memoire.png`. Garde le jardin peint avec les parcelles (`care.garden.index.tsx`) comme porte d'entrée. Les souvenirs d'un proche n'apparaissent qu'après validation. Fichiers dans un bucket privé (§11).
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D6 — Soutien : l'accueil et les quatre fonctions (captures D050 à D060 + plan-au-bon-moment.png)

```
Étape D6 sur D13 : Soutien : l'accueil et les quatre fonctions. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D050 · Soutien · accueil → /care (modifié)
   - D051 · Soutien · ce qui m'aiderait → /care/aide (à créer)
   - D052 · Soutien · à qui l'envoyer → /care/aide/envoyer (à créer)
   - D053 · Soutien · qui s'occupe de quoi → /care/aide/suivi (à créer)
   - D054 · Soutien · parler à quelqu'un → /care/parler (à créer)
   - D055 · Soutien · un psychologue remboursé → /care/parler/psychologue (à créer)
   - D056 · Soutien · le point du mois (1 sur 3) → /care/point (à créer)
   - D057 · Soutien · le point du mois, quand c'est lourd → /care/point/resultat (à créer)
   - D058 · Soutien · le point du mois, quand ça avance → /care/point/resultat (à créer)
   - D059 · Soutien · reprendre le travail → /care/travail (à créer)
   - D060 · Soutien · un message pour les collègues → /care/travail/message (à créer)

- Joins `plan-au-bon-moment.png`. Applique `donnees/moments.json` : une seule carte à la fois sur Aujourd'hui (§6). Le point du mois ne pose jamais de diagnostic.
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D7 — Pour les proches : ce qui m'aiderait, et comment aider (captures D061 à D065)

```
Étape D7 sur D13 : Pour les proches : ce qui m'aiderait, et comment aider. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D061 · Soutien · la page reçue par les proches → /aide/$lien (à créer)
   - D062 · Pour les proches · aider concrètement → /aide/$lien/aider (à créer)
   - D063 · Pour les proches · quoi dire, quoi éviter → /aide/$lien/mots (à créer)
   - D064 · Pour les proches · être là dans la durée → /aide/$lien/dates (à créer)
   - D065 · Pour les proches · si vous êtes inquiet → /aide/$lien/inquiet (à créer)

- Les pages pour les proches s'ouvrent par un **lien sécurisé, sans compte**, qui expire après 30 jours (§10). Garde les sources affichées en bas de chaque page.
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D8 — Démarches : les états, l'accès « Je suis bloqué », les échéances (captures D066 à D076 + plan-echeances.png)

```
Étape D8 sur D13 : Démarches : les états, l'accès « Je suis bloqué », les échéances. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D066 · Démarches · avant les obsèques → /practical (modifié)
   - D067 · Démarches · après les obsèques → /practical (modifié)
   - D068 · Démarches · presque tout est fait → /practical (modifié)
   - D069 · Démarches · quelqu'un s'en occupe → /practical (modifié)
   - D070 · Démarches · l'accès « Je suis bloqué » → /practical (modifié)
   - D071 · Je suis bloqué · la carte sur Aujourd'hui, les premiers jours → /home (modifié)
   - D072 · Échéances · vos échéances → /practical/echeances (à créer)
   - D073 · Échéances · une échéance → /practical/echeances/$id (à créer)
   - D074 · Échéances · vos rappels → /practical/echeances/rappels (à créer)
   - D075 · Échéances · rappel sur Aujourd'hui → /home (modifié)
   - D076 · Échéances · l'année prochaine → /practical/echeances/annee (à créer)

- Joins `plan-echeances.png`. Les échéances viennent de `donnees/echeances.json` (§8). « Je suis bloqué » apparaît dans les quatre états de Démarches (§7).
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D9 — Je suis bloqué (1/3) : les cinq familles et Présence (captures D077 à D083 + plan-je-suis-bloque.png)

```
Étape D9 sur D13 : Je suis bloqué (1/3) : les cinq familles et Présence. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D077 · Je suis bloqué · les situations → /practical/bloque (à créer)
   - D078 · Je suis bloqué · décrire sa situation à Présence → /practical/bloque/presence (à créer)
   - D079 · Je suis bloqué · Les premières <em style="font-style:italic;color:#D9653F;">heures.</em> → /practical/bloque/cat-heures (à créer)
   - D080 · Je suis bloqué · Accès, argent,<br><em style="font-style:italic;color:#D9653F;">papiers.</em> → /practical/bloque/cat-acces (à créer)
   - D081 · Je suis bloqué · Famille, maison,<br><em style="font-style:italic;color:#D9653F;">travail.</em> → /practical/bloque/cat-famille (à créer)
   - D082 · Je suis bloqué · Il est en vie mais<br><em style="font-style:italic;color:#D9653F;">ne peut plus décider.</em> → /practical/bloque/cat-vivant (à créer)
   - D083 · Je suis bloqué · Les sommes<br><em style="font-style:italic;color:#D9653F;">à demander.</em> → /practical/bloque/cat-aides (à créer)

- Joins `plan-je-suis-bloque.png`. Crée un seul composant de page pour toutes les situations, alimenté par `donnees/je-suis-bloque.json` (§7).
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D10 — Je suis bloqué (2/3) : premières heures ; accès, argent, papiers (captures D084 à D095)

```
Étape D10 sur D13 : Je suis bloqué (2/3) : premières heures ; accès, argent, papiers. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D084 · Je suis bloqué · Le décès a eu lieu à la maison. → /practical/bloque/maison (à créer)
   - D085 · Je suis bloqué · À l'hôpital ou en maison de retraite. → /practical/bloque/hopital-deces (à créer)
   - D086 · Je suis bloqué · Un accident, une mort inexpliquée. → /practical/bloque/enquete (à créer)
   - D087 · Je suis bloqué · Le décès a eu lieu à l'étranger. → /practical/bloque/etranger (à créer)
   - D088 · Je suis bloqué · Le décès d'un enfant. → /practical/bloque/enfant-deces (à créer)
   - D089 · Je suis bloqué · Après un suicide. → /practical/bloque/suicide (à créer)
   - D090 · Je suis bloqué · Je n'ai pas ses mots de passe. → /practical/bloque/mots-de-passe (à créer)
   - D091 · Je suis bloqué · Ses comptes en ligne. → /practical/bloque/comptes (à créer)
   - D092 · Je suis bloqué · Je ne trouve pas ses papiers. → /practical/bloque/papiers (à créer)
   - D093 · Je suis bloqué · Je n'ai plus accès à l'argent. → /practical/bloque/argent (à créer)
   - D094 · Je suis bloqué · Ses crédits et ses dettes. → /practical/bloque/credits (à créer)
   - D095 · Je suis bloqué · Ses abonnements et contrats. → /practical/bloque/contrats (à créer)

- Même composant, mêmes données. Branche les boutons d'action sur les pages réutilisées et les liens officiels (§4, §13).
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D11 — Je suis bloqué (3/3) : famille ; il ne peut plus décider ; les sommes ; prévenir (captures D096 à D108)

```
Étape D11 sur D13 : Je suis bloqué (3/3) : famille ; il ne peut plus décider ; les sommes ; prévenir. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D096 · Je suis bloqué · Les enfants mineurs. → /practical/bloque/enfants (à créer)
   - D097 · Je suis bloqué · Le logement. → /practical/bloque/logement (à créer)
   - D098 · Je suis bloqué · La voiture. → /practical/bloque/voiture (à créer)
   - D099 · Je suis bloqué · La maison, les enfants, → /practical/bloque/quotidien (à créer)
   - D100 · Je suis bloqué · Votre travail. → /practical/bloque/conges (à créer)
   - D101 · Je suis bloqué · Son travail ou son entreprise. → /practical/bloque/son-travail (à créer)
   - D102 · Je suis bloqué · Il est à l'hôpital, il ne peut plus parler. → /practical/bloque/hopital (à créer)
   - D103 · Je suis bloqué · Agir à sa place, durablement. → /practical/bloque/habilitation (à créer)
   - D104 · Je suis bloqué · Son téléphone, ses comptes. → /practical/bloque/telephone (à créer)
   - D105 · Je suis bloqué · Le capital décès. → /practical/bloque/capital (à créer)
   - D106 · Je suis bloqué · La pension de réversion. → /practical/bloque/reversion (à créer)
   - D107 · Je suis bloqué · L'assurance-vie et la prévoyance. → /practical/bloque/assurance-vie (à créer)
   - D108 · Préparer · ne pas laisser vos proches bloqués → /practical/bloque/preparer (à créer)

- Même composant. « Il ne peut plus décider » est aussi accessible depuis Aides (proche malade). « Ne pas laisser vos proches bloqués » ouvre le coffre.
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D12 — Mon coffre pour mes proches (captures D109 à D118 + plan-coffre.png)

```
Étape D12 sur D13 : Mon coffre pour mes proches. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D109 · Penser à la mort · Préparer → /practical (je pense à la mort) (modifié)
   - D110 · Coffre · mon coffre pour mes proches → /practical/coffre (à créer)
   - D111 · Coffre · ajouter un document → /practical/coffre/ajouter (à créer)
   - D112 · Coffre · un document → /practical/coffre/$id (à créer)
   - D113 · Coffre · qui reçoit quoi → /practical/coffre/destinataires (à créer)
   - D114 · Coffre · comment ils seront transmis → /practical/coffre/transmission (à créer)
   - D115 · Coffre · alerte pendant les sept jours (plein écran) → (plein écran, notification) (à créer)
   - D116 · Coffre · le proche fait la demande → /practical/coffre-recu/demande (à créer)
   - D117 · Coffre · la demande est en cours → /practical/coffre-recu/attente (à créer)
   - D118 · Coffre · les documents reçus → /practical/coffre-recu (à créer)

- Joins `plan-coffre.png`. Applique §9 : vérification de l'acte de décès, sept jours de sécurité, chacun ne reçoit que ce qui lui est destiné, jamais de mot de passe.
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D13 — Présence qui guide (captures D119 à D122)

```
Étape D13 sur D13 : Présence qui guide. Fais ces écrans en suivant leur capture, leur section de `maquettes.html` et `02-ECRANS.md` :
   - D119 · Présence · conversation → /presence (modifié)
   - D120 · Présence · guide vers le soutien → /presence (à créer)
   - D121 · Présence · guide vers les démarches → /presence (à créer)
   - D122 · Présence · ce qu'elle peut faire → /presence/infos (à créer)

- Lis `04-PRESENCE.md` en entier et construis Présence en conséquence : base de connaissances (`donnees/`), contexte de l'espace, cartes d'action, règles de sécurité. Garde `presence.functions.ts`.
Relie chaque bouton de ces écrans comme indiqué dans `03-BOUTONS.md`.
Avant de coder, écris pour chaque écran quatre courtes listes : 1) ce que tu réutilises ; 2) ce que tu modifies ; 3) ce que tu crées ; 4) ce qui existe dans le code mais pas dans la maquette (attends ma réponse avant de supprimer). Ensuite, code les points 1 à 3.
```

---

## Message D14 — Vérification complète

```
Vérifie tout ce dossier :
1. Chaque écran D001 à D122 ressemble à sa capture.
2. Chaque bouton fait ce que dit `03-BOUTONS.md` : aucun ne mène nulle part. Liste, pour chaque page réutilisée, tous les boutons qui l'ouvrent, et montre-moi qu'aucune n'existe en double.
3. Les écrans du premier dossier remplacés (§12) ne sont plus accessibles en double.
4. Les grands titres de Démarches sont en vert profond ; le mot « 6 jours » n'apparaît plus nulle part (délai des obsèques : 14 jours).
5. « Au bon moment » : une seule carte à la fois sur Aujourd'hui, dans l'ordre de `donnees/moments.json`.
6. Confidentialité : buckets privés, aucune URL publique, Row Level Security sur toutes les tables. Teste avec un deuxième compte et sans compte, et montre-moi le résultat.
7. Présence : passe les 40 questions de test de `04-PRESENCE.md` et donne-moi, pour chacune, ce qu'elle a proposé.
Donne-moi la liste de ce que tu as corrigé.
```
