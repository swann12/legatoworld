# Ajouts n° 4 — règles

Ces règles complètent `legato-design/01-SYSTEME-DE-DESIGN.md` et `legato-design/ajouts-2/01-REGLES.md`. En cas de doute, la capture fait foi.

## 1. Couleurs : ce qui change
- **Grands titres de Démarches en vert profond.** La fin en italique des grands titres de tous les écrans de Démarches (deuil et animal) passe du corail `#D9653F` au vert profond `#2C4B40`. **Seuls les grands titres changent** : numéros, étiquettes, badges et barre d'avancement restent en corail. Écrans du premier dossier concernés : f-avancement, f-ceremonie, f-confier-demarche, f-courrier, f-demarches, f-details-ceremonie, f-documents, f-envoyer-choix, f-etapes, f-fleurs, f-fleurs-proposition, f-fleurs-questions, f-livret, f-modele-courrier, f-objets, f-pompes-funebres, f-prestataire, f-reperes, f-textes, f-textes-proposition, f-une-demarche, f-volontes, f-volontes-obseques. Tous les écrans D de Démarches suivent déjà cette règle. L'écran des couleurs (D001) est à jour.
- Le reste du système ne change pas : Aujourd'hui bleu ; Soutien lin et bleu ciel ; Démarches lin et corail (repères) ; Mémoire et Communauté rose et bordeaux ; proche malade rose et bleu ; « je pense à la mort » tout en rose ; urgences (15, 3114) en bordeaux partout. Une carte de Démarches affichée sur Aujourd'hui garde son étiquette corail.

## 2. Les dégradés (voir `degrades.png`)
- Trois couleurs au plus, de la même famille.
- **Un écran plein écran reprend les couleurs du bouton qui l'ouvre**, et ses boutons gardent ce couple : Soutien entre bleu ciel `#CFDBE8` et vert profond `#2C4B40` (tons intermédiaires `#A9D6C4`, `#8FAAB8`, `#A4C3C4`, `#5E8F7F`, `#4F7270`) ; Mémoire et Rituels entre rose `#EBC7C4` et bordeaux `#7A2E2C`.
- Pas de dégradé à l'endroit des photos (aplat rose pâle). Pas de pictogrammes dans les listes de souvenirs.

## 3. Des mots que tout le monde comprend
- **« En clair »** : sous le titre d'une page dont le sujet est un mot technique, un encadré lin donne la définition en une phrase.
- **Les mots techniques sont expliqués dans la phrase** (« l'AGIRA, l'organisme qui recherche les contrats »).
- **« Le mot expliqué » (D005)** : un mot technique est souligné en pointillés ; en le touchant, une fenêtre s'ouvre avec la définition, « Pour vous, maintenant », et un lien vers la page complète.
- **Un seul lexique** : `donnees/lexique.json` (et `05-LEXIQUE.md`), utilisé par la fenêtre et par Présence.

## 4. Les pages réutilisées (voir `donnees/pages-reutilisees.json`)
Une **page réutilisée** est construite **une seule fois** comme composant, puis ouverte par plusieurs boutons ; son contenu vient du bouton et de l'espace. **Ne jamais construire une page séparée pour chaque bouton.**
| Page | Écran | Ouverte par |
|---|---|---|
| Un message prêt | D006 | prévenir l'employeur, les collègues, relancer, prendre rendez-vous… |
| Avant d'ouvrir un site officiel | D007 | chaque formulaire de l'État (capital décès, réversion, carte grise, AGIRA…) |
| Un document | D008 | les documents reçus, les attestations |
| Un dossier de documents | D009 | les catégories de « Ses papiers » |
| Prévenir les proches | D010 | « Prévenir les proches » (Démarches) |
| Un article d'aide | D011 | les questions du centre d'aide, « Ce qu'il faut savoir avant » |
| Confirmer une suppression | D012 | supprimer un espace, son compte, effacer les conversations |
| Mot de passe oublié | D013 | la connexion |
| Le courrier pré-rempli | écran du premier dossier (modèle de courrier) | tous les « courrier prêt » |
| Ajouter une phrase, un lieu, un objet, une date | D041 | Mémoire, recettes, objets |
| Une fiche (souvenir, tradition, film, livre) | D037, et fiches du dossier ajouts-2 | chaque élément d'une liste |
Les **boutons sans page** (enregistrer, appeler, choisir sur place) répondent toujours d'une des trois façons montrées sur **D004** : un message bref, une confirmation, ou une sélection qui change. La mention « Page réutilisable » ne doit **jamais** apparaître dans l'application.

## 5. Chaque bouton a sa réponse
`03-BOUTONS.md` (et `legato-boutons.xlsx`) liste **chacun des 1 204 boutons** des écrans finaux, avec ce qu'il ouvre. Aucun bouton ne doit mener nulle part. Les écrans remplacés (§12) ne doivent pas être construits en double.

## 6. Au bon moment (voir `plan-au-bon-moment.png` et `donnees/moments.json`)
Tout reste toujours accessible au même endroit. Legato ne propose une chose d'elle-même que lorsqu'elle a du sens. **Une seule carte à la fois sur Aujourd'hui**, dans cet ordre : sécurité (3114) → échéance à moins de 7 jours → « Je suis bloqué » (14 premiers jours) → reprise du travail (3 jours avant) → point du mois → ce qui m'aiderait.

## 7. « Je suis bloqué » (voir `plan-je-suis-bloque.png`)
- Accès : encadré en haut de Démarches dans **les quatre états** ; carte sur Aujourd'hui les premiers jours ; « Il ne peut plus décider » dans Aides (proche malade) ; Présence.
- Trois touches au plus : Je suis bloqué → famille → situation. **Une page = un écran** : en clair, trois étapes dans l'ordre avec leur bouton, les papiers, la source, le statut.
- **Les contenus sont des données** : `donnees/je-suis-bloque.json`. Un seul composant affiche toutes les situations. Statut `a_verifier` → afficher « à vérifier » sous la source.
- **Délai des obsèques : 14 jours** calendaires (décret du 10 juillet 2024), et non 6 jours ouvrables : à corriger partout dans le code.

## 8. Vos échéances (voir `plan-echeances.png`)
Calculées à partir de la date du décès et des réponses de la première ouverture, selon `donnees/echeances.json`. Rappels : 7 jours avant puis la veille, jamais avant 10 h ni le soir ; « Confier à un proche » ouvre « Demander un coup de main ».

## 9. Mon coffre pour mes proches (voir `plan-coffre.png`)
- Côté propriétaire (espace « je pense à la mort », en rose) : déposer des documents, choisir qui reçoit quoi.
- **Transmission** : le proche dépose l'acte de décès → Legato vérifie l'acte et l'identité → **sept jours de sécurité** pendant lesquels le propriétaire est prévenu et peut tout arrêter → transmission, chacun ne recevant que ce qui lui est destiné. Option : si le propriétaire est hospitalisé, seules ses directives anticipées vont à sa personne de confiance.
- **Legato ne garde jamais de mots de passe**, seulement où les trouver. L'original d'un testament reste chez la personne ou le notaire.
- À faire valider par un juriste avant la mise en ligne, ainsi que l'hébergement des données de santé (§11).

## 10. Soutien et pages pour les proches (voir `plan-au-bon-moment.png`)
- Nouvel accueil de Soutien (D050) avec « Pour vous, en ce moment » en haut.
- « Ce qui m'aiderait » : les proches reçoivent un **lien sécurisé, sans compte**, qui expire après 30 jours et ne montre que la liste de besoins (D061) ; ils choisissent « Je m'en occupe ». Le guide « Comment aider » (D062 à D065) cite ses sources.
- Le point du mois ne pose jamais de diagnostic ; s'il est lourd, il propose un professionnel.
- « Présence, à toute heure » est présentée comme une intelligence artificielle, jamais comme une écoute humaine.

## 11. Confidentialité des documents (à appliquer dans le code)
Tout ce qu'une personne dépose est **privé par défaut**, lisible seulement par une personne connectée qui en a le droit.
- Supabase Storage : buckets **privés**, chemins par espace, **jamais d'URL publique**, seulement des URL signées de courte durée.
- **Row Level Security sur toutes les tables** : le propriétaire, ou un membre du cercle pour ce qui lui a été explicitement partagé.
- Aucun contenu dans les journaux techniques. Export et suppression des données dans les réglages.
- Données de santé (directives, documents médicaux) : en principe un hébergeur certifié HDS ; **à valider avec un juriste** avant d'ouvrir ce dépôt.

## 12. Écrans du premier dossier remplacés (ne pas construire en double)
| Premier dossier | Remplacé par |
|---|---|
| Soutien (accueil) | D050 |
| Le corps et ses pages | D014 à D025 |
| Repères (démarches) | « Je suis bloqué », D077 à D108 |
| Démarches (accueil) | D066 à D069 |
| Mémoire, souvenirs, photos, voix, ajouter, portrait, livre | D033 à D049 |
| Une conversation | D002 |
| Présence | D119 |

## 13. Liens officiels (pour brancher les boutons)
| Action | Cible |
|---|---|
| Acte de décès en ligne | https://demarches.service-public.fr/mademarche/EtatCivil/demarche?action=DECES |
| Guide « Un proche est décédé » | https://www.service-public.fr/particuliers/vosdroits/F16507 |
| Déclaration de décès | https://www.service-public.fr/particuliers/vosdroits/F909 |
| Compte Apple d'une personne décédée | https://support.apple.com/fr-afri/102431 |
| Assurance-vie, contrat obsèques (AGIRA) | https://www.agira-vie.fr |
| Comptes oubliés (Ciclade) | https://www.ciclade.fr |
| Pension de réversion | https://www.info-retraite.fr |
| Carte grise | https://ants.gouv.fr |
| Impôts : signaler un décès | 0809 401 401 |
| Prévention du suicide, aussi pour les proches | 3114 |
| Écoute deuil (association Empreintes) | 01 42 38 08 08 |
| Urgence médicale | 15 |
| Capital décès, psychologue remboursé | ameli.fr (formulaires à vérifier) |
| Google, Facebook, Instagram | formulaires d'aide officiels (à vérifier) |
