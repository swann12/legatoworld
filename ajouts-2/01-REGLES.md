# Ajouts — règles nouvelles

Ces règles complètent `legato-design/01-SYSTEME-DE-DESIGN.md`. Le reste du système ne change pas. En cas de doute, la capture fait foi.

## 1. Le logo dans l'en-tête
Quand l'en-tête affiche le nom de l'application, c'est **toujours le logo LEGATO** (`assets/logo-legato.png`), **66 px de large**, jamais le mot écrit. En mode nuit : `assets/logo-legato-creme.png`.

## 2. Quatre types d'espace
La première question de la première ouverture fixe le type de l'espace :
- **Une personne qui est décédée** (le parcours du premier dossier) ;
- **Un animal qui est mort** ;
- **Un proche gravement malade** ;
- **Moi : je pense souvent à la mort**.
Les questions suivantes dépendent de ce choix (voir les écrans « onb » de chaque parcours). Chaque page lit le type de l'espace actif et affiche la bonne version, sur les mêmes routes (`/home`, `/care`, `/practical`, `/care/garden/space`, `/care/community`).

## 3. Les menus s'adaptent (voir `plan-menus.png`)
| Type d'espace | Onglets |
|---|---|
| Personne décédée | Aujourd'hui · Soutien · Démarches · Mémoire · Communauté |
| Animal | Aujourd'hui · Soutien · Démarches · Mémoire · Communauté |
| Animal, si « tout est fait » ou « je préfère ne pas y penser » | Aujourd'hui · Soutien · Mémoire · Communauté (pas de Démarches) |
| Proche gravement malade | Aujourd'hui · Soutien · **Aides** · **Souvenirs** · Communauté |
| Je pense beaucoup à la mort | Aujourd'hui · Soutien · **Préparer** · **Transmettre** · Communauté |
Le titre de l'en-tête de chaque onglet reprend le même mot (« Aides », « Préparer »…).

## 4. Couleurs
- **Personne décédée et animal** : les couples du premier dossier (Démarches en lin, corail et bouton bleu ; Mémoire et Communauté en rose et bordeaux).
- **Proche gravement malade** : Aides, Souvenirs et Communauté en **rose et bleu** (bloc rose `#EBC7C4`, bouton bleu `#CFDBE8` à texte vert profond, accents vert profond). Jamais de corail ni de bordeaux : personne n'est parti.
- **Je pense beaucoup à la mort** : **tout l'espace en rose et vert profond**. Blocs roses, boutons roses à texte vert profond, et boutons au trait vert profond à l'intérieur d'un bloc rose. Pas de bleu, pas de lin, pas de corail. Seule exception : l'écran du 3114 garde son bloc bordeaux, comme toutes les pages d'urgence.
- L'écran des couleurs (B001) montre la ligne « rose et bleu ».

## 5. Première ouverture : « C'est prêt »
Même modèle pour les quatre parcours (B005 et les écrans « c'est prêt » de chaque parcours) : un résumé encadré (pour qui, depuis quand ou où elle en est, ce qui passe en premier), trois colonnes sur ce qui va se passer, puis le bouton.

## 6. Démarches selon la réponse (voir `plan-demarches.png`)
La réponse à « Où en êtes-vous avec les papiers ? » décide de ce que montre l'onglet Démarches :
- **Rien n'est commencé** (les obsèques n'ont pas eu lieu) : pompes funèbres et **cérémonie en premier** ; banque, organismes et succession plus bas. La cérémonie n'apparaît **que** dans ce cas.
- **Les obsèques sont passées** : la cérémonie est cochée comme faite ; acte de décès et banque en premier.
- **Presque tout est fait** : il reste la succession et quelques contrats.
- **Quelqu'un s'en occupe** : on ne voit que ce que la personne choisie demande.
La réponse se change à tout moment dans les réglages de l'espace.

## 7. Sécurité
- Parcours « je pense beaucoup à la mort » : la réponse « Parfois, l'envie de ne plus être là » ouvre **immédiatement** l'écran « Penser à la mort, ou penser à mourir ? » avec le 3114. Cet écran reste accessible depuis Aujourd'hui.
- Le corps : « Quand consulter » met le 15 en premier pour la douleur dans la poitrine, l'essoufflement soudain ou le malaise.
- « Besoin d'aide → » reste en haut de tous les écrans standard.

## 8. Visiteurs : découvrir sans compte
- Bienvenue propose « Créer mon espace », « Découvrir sans compte » et « J'ai déjà un compte ».
- En découverte, on répond aux mêmes questions et on utilise l'application. **Tout est gardé sur le téléphone** (stockage local), rien n'est envoyé.
- Un bandeau « Mode découverte » reste visible, avec « Créer mon espace ».
- Il faut un compte pour inviter un proche, écrire dans un groupe et retrouver son espace sur un autre appareil.
- À la création du compte, tout ce qui a été fait en découverte est repris dans l'espace.

## 9. Présence : une conversation
- Vos messages : dans un encart lin, arrondi (18 px, coin bas droit 4 px), aligné à droite, en Instrument Serif 18 px.
- Présence : directement sur le fond, sans encart, en Instrument Serif 19 px.
- En bas : une barre arrondie « Écrire à Présence… » avec micro et bouton d'envoi bleu.

## 10. Le corps
Le sommaire présente six tuiles (deux colonnes, fond lin), puis « Comprendre et suivre ». Le petit suivi montre la semaine en points, sans note ni objectif.

## 11. Rituels
L'accueil propose cinq entrées numérotées (un geste maintenant, à plusieurs, les rituels du monde, le calendrier, vos rituels) et le lien « Présence vous en propose trois ». `plan-rituels.png` montre quel bouton mène à quel écran. Les 21 traditions des écrans régions suivent toutes le modèle de fiche de l'écran « une tradition expliquée ». Le calendrier mêle les dates du monde et celles de l'utilisateur.

## 12. Lire, écouter, voir
Trois onglets (Lire, Écouter, Voir) plus « Gardés ». Dans chaque onglet, un bloc permet de demander à Présence d'autres suggestions ; l'écran de suggestions accepte une phrase libre et des précisions, et Présence explique chaque proposition.

## 13. Écrans du premier dossier remplacés
002 Bienvenue → visiteur-bienvenue · 010 C'est prêt → cest-pret · 026, 027, 028 → les pages Aujourd'hui des parcours · 031 Présence → presence · 040 Lire, écouter → lire · 048 Le corps → corps · 090 Un geste pour elle → rituels · 101 Questions au médecin → malade-questions · 103 En parler à un enfant → animal-enfant.
