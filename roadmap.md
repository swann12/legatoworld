# Reprise UX/UI Legato

## Régression des quatre parcours — priorité 22 octobre
- [ ] Corriger la perte du type d’espace après choix d’émotions dans la première ouverture ; tester animal, malade, questions et deuil de bout en bout.
- [ ] Faire ouvrir Mémoire / Souvenirs / Transmettre sur Space dans tous les parcours, sans retour involontaire aux parcelles.

## Vérifications ordonnées et menu — 22 octobre
- [x] 14 scénarios du moteur passent ; six situations 1, 3, 5, 7, 8, 10 : résultats des trois accueils comparés au simulateur et 18 captures produites.
- [ ] Vérifier Bienvenue sans bascule, navigation verte et nouvelle découverte vide.
- [ ] Corriger double sélection du menu, préparer ses destinations et ouvrir Mémoire sur /care/garden/space.
- [ ] Vérifier cartes uniques, absence de Respirer en carte et point mensuel après Présence ; fournir les comparaisons.

## Ajouts-5 E001–E003
- [x] Question facultative après le prénom pour personne décédée, réponse conservée dans l’espace ; parcours jusqu’à Aujourd’hui vérifié.
- [x] Choix multiple de 14 émotions, conservation quotidienne par espace et adjectifs sur Aujourd’hui ; modification et relecture après rechargement vérifiées, quatre tests passent.
- [x] E003 Recommencer / Reprendre testé : reprise des émotions, puis effacement des réponses ; huit tests découverte passent.
- [ ] Fidélité exacte E001–E003 : 02-ECRANS.md, maquettes.html et captures Ajouts-5 absents des documents accessibles ; mise en page fondée sur les règles et le système existant.

## Ajouts-5 §1
- [x] Polices fournies locales, préchargement et attente pendant l’ouverture.
- [x] Navigation vert profond indépendante des palettes.
- [x] Découverte neuve vide, E003 reprise/recommencer et vérifications.

## Ajouts-5 Aujourd’hui
- [x] Moteur issu du JSON et structure §4 ; 14 scénarios conformes, E004–E008 vérifiés à 390 px avec réponses et dates identiques ; émotions modifiées et relues après rechargement.
- [x] Retirer les éléments hors structure demandés : Inviter un proche seul, Cette semaine, ancienne ligne date, introduction et propositions anciennes ; pages conservées.

## Ajouts-5 Démarches et cinq accueils
- [x] Réunir la logique dans moteur-legato, sans nouvelles modifications d’écran ; 14 situations complètes et 35 combinaisons de limites comparées au simulateur.
- [x] Refaire les quatre réponses papiers, ajouter Présence en fin des cinq accueils et retirer ses boutons flottants ; parcours deuil et quatre liens principaux ouverts.
- [ ] Audit complet des variantes : les accueils deuil ont été vérifiés ; les autres types nécessitent une nouvelle vérification après affichage réel du contenu. Retouches d’écran suspendues à la demande « Ne touche pas encore aux écrans ».

## Ajouts-5 Soutien
- [x] Accueil deuil §6 branché au moteur : 14 scénarios et 4 règles ciblées passent ; E009–E011 ouverts, liste d’aide et point mensuel jusqu’au résultat vérifiés ; Présence précède le point final. Anciennes pages conservées.

## Étape D5 — Mémoire approfondie
- [x] Présenter les quatre listes D033–D049 et conserver les éléments hors maquette.
- [x] Créer les pages et liens communs, sans toucher au jardin peint ni aux parcelles ; anciennes variantes conservées.
- [x] Dépôt privé de 50 Mo et règles d’accès appliqués ; contributions en attente, liens de cercle isolés par parcelle.
- [x] Vérifier phrase/modification/livre, fichiers photo et voix, portrait et date persistants ; dix tests réussis, écrans ouverts à 390 px et 1280 px sans erreur navigateur.
- [ ] Invitation, dépôt privé et validation connectés de bout en bout : connexion du demandeur dans l’aperçu nécessaire ; aucune session correspondante disponible.
- [ ] Paiement et impression : prestataire absent ; l’écran informe qu’aucune commande ni aucun paiement ne seront lancés.

## Étape D4 — sons de bien-être (ajouts-4)
- [x] Présenter les quatre listes D026–D032 avant le code et conserver l’existant.
- [x] Reproduire les sept écrans, relier les boutons et garder un lecteur commun pendant la navigation ; ancienne page archivée sans supprimer le moteur existant.
- [x] Fournir dix fichiers de démonstration originaux, minuteur audio natif, mélange et favoris locaux ; voix synthétiques et textes originaux à relire.
- [x] Vérifier lecture, reprise, réglages, mélange, favoris persistants et arrêt audio en onglet arrière-plan ; cinq tests réussis, aucune erreur navigateur, mobile et desktop ouverts.
- [ ] Vérification téléphone réellement verrouillé : appareil physique indisponible. Le navigateur/OS peut interrompre la lecture ; assombrissement visuel seulement.

## Étape D3 — le corps (ajouts-4)
- [x] Quatre listes présentées pour D014–D025 avant le code.
- [x] D014 tuiles reliées ; D015–D018 créées via CorpsTopicPage ; D019 soin refait (fiches → D020) ; D020 exercice plein écran ; D021 modifié ; D022 marche plein écran (voix + minuteur) ; D023 modifié ; D024 noter créé ; D025 déjà conforme.
- [x] Vérifié sur téléphone : parcours sommaire → dormir → exercice → retour, noter → suivi (2 points enregistrés), minuteur 10:00 ; 3 tests suivi réussis, tsgo OK.
- [ ] Anciennes pages nuits / manger / eau / habiller / soin/$id conservées (§12 les remplace) : attendre l'accord pour supprimer.
- [ ] D016 « Demander un repas » ouvre D006 en attendant D051 (/care/aide) ; D025 « Parler à quelqu'un » garde /crisis en attendant D054 (/care/parler).

## Étape D2 — pages réutilisées (ajouts-4)
- [x] Présenter les quatre listes pour D006–D013 avant le code.
- [x] Créer les huit écrans : /partage/message, /partage/site-officiel, /documents/$id, /documents/dossier/$categorie, /practical/prevenir, /aide/$article, /reglages/supprimer, /auth/mot-de-passe ; composants paramétrables dans shared-pages.tsx ; ligne « Prévenir les proches » de Démarches reliée.
- [x] Vérifier les huit écrans sur téléphone : copie avec repli, « Voir le message » → D006 avec paramètres, SUPPRIMER qui débloque le bouton ; 5 tests démarches réussis, tsgo OK.
- [ ] Relier les boutons appelants (listes utilisee_par de pages-reutilisees.json) : étapes suivantes.
- [ ] Articles « supprimer un souvenir » et « données protégées » rédigés par l'agent : relecture attendue.
- [ ] D008 : les documents locaux n'ont pas de fichier joint ; Télécharger/Partager répondent par un message, en attente du stockage de fichiers.

## Étape D1 — règles transverses (ajouts-4)
- [x] Présenter les quatre listes pour D001–D005 avant le code.
- [x] §1 titres Démarches en vert (token --sp-title-accent) ; §2 dégradé Mémoire rose→bordeaux, texte et bouton rose (ExperienceButton) ; §3 MotExplique + lexique.json (37 mots) ; §7 délai obsèques 14 jours ; D002 conversation refaite ; D004 SavedToast/ConfirmSheet/ConfirmedCall (15).
- [x] Vérifier sur téléphone : titre vert + chiffres corail, fenêtre du mot, lettre en dégradé, conversation (pensée 13, réponse), confirmation du 15 ; 4 tests lexique réussis, tsgo OK.
- [ ] Étapes D2 à D14 de 00-PROMPTS.md : en attente de la demande.
- [ ] « En clair » (composant créé) n'est pas encore posé sur les pages de démarches : le dossier ne liste pas encore les écrans concernés.

## Vérification des ajouts — 18 octobre 2026
- [x] Retrouver les captures originales 001–080 dans l’archive et inventorier logos, menus, sécurité et rituels.
- [x] Corriger l’ancien logo, les palettes rose/bleu et leur navigation, y compris repères des parcelles et expériences Mémoire.
- [x] Vérifier les quatre espaces et le 3114 immédiat ; corriger et tester Obon → organisation, calendrier → ofrenda et lanterne → geste fait.
- [x] Ouvrir les 80 destinations et comparer les captures en planches ; conserver les différences Ajouts-2 et les données variables.
- [ ] Comparaison exacte des états 005, 012, 014, 026–028, 031, 036, 038, 073 et 075 : invitation valide, conversation réelle, choix/enregistrements/propositions nécessaires ; les seules ouvertures ne valident pas ces états.
- [x] Donner les corrections et préciser que ni tous les états ni tous les liens connectés ne sont validés.

## Étape B13 — Lire, écouter, voir
- [x] Présenter les quatre listes pour B114–B118 avant le code.
- [x] Reproduire les onglets, la fiche film et les suggestions ; conserver les ressources hors maquette.
- [x] Vérifier les favoris persistants, les retours, une proposition réelle et l’absence d’envoi en découverte ; quatre tests réussis.
- [ ] Vérification connectée de bout en bout : aucune session du demandeur disponible ; connexion dans l’aperçu attendue.
- [ ] Comparaison aux captures individuelles : captures B114–B118 non jointes.

## Étape B2 — découverte sans compte
- [x] Présenter quatre listes pour B007–B012 ; profil : prénom et préférences confirmés.
- [x] Créer les pages, bandeau et questions en découverte ; aucun envoi de contenu observé.
- [x] Bloquer invitations et écriture en groupe ; reprise privée après compte confirmé implémentée, données locales non effacées.
- [x] Vérifier parcours complet, création espace, lettre et rechargement, protections et écrans.
- [ ] Reprise connectée de bout en bout : session indisponible, aucun compte correspondant au demandeur ; connexion dans la prévisualisation attendue.
- [ ] Captures individuelles non jointes ; suppression hors maquette attend l'accord utilisateur.

## Étape B1 — écrans B001 à B006
- [x] Présenter quatre listes par écran avant le code.
- [x] Adapter logos, quatre types, menus et palettes sans modifier ouverture ni jardin peint.
- [x] Reproduire Aujourd’hui, nuit, invitation, résumé et conversation Présence ; invitation générique faute de noms disponibles.
- [x] Vérifier les quatre créations, envoi réel/persistance, menus, nuit, invitation vers connexion ; 10 tests réussis.
- [ ] Comparaison aux captures individuelles : captures B001–B006 non jointes.
- [ ] Acceptation d’une invitation réelle : lien valide d’un proche attendu.
- [ ] Suppression hors maquette : accord utilisateur attendu.

## Contrôle final du système de design
- [ ] Auditer le tableau des écrans et les liens, corriger couleurs, boutons, aide, navigation et ornements.
- [ ] Vérifier l’animation d’ouverture et les parcelles sans modifier leur fonctionnement.
- [ ] Donner la liste des corrections et les éventuels écarts non vérifiés.

## Étape 13 — Communauté
- [x] Présenter les quatre listes avant le code pour 095–100, 111 et 112.
- [x] Reproduire les huit écrans et garder community-store et community-data.
- [x] Vérifier conversation, écriture, recherche et inscription locale à la veillée.
- [ ] Suppression hors maquette : en attente d’accord utilisateur.

- [ ] Conserver la barre Soutien / Démarches actuelle, désormais validée.
- [ ] Reprendre le Jardin coloré : parcelles par proche, évolution selon les souvenirs, dépôt séparé et wording réduit.
- [ ] Refaire Journal avec une vraie dimension carnet intime contemporaine et craft.
- [ ] Reprendre Respirer comme expérience immersive, méditative, instinctive et très peu textuelle.
- [ ] Reprendre Sans mots autour de matière, mouvement, texture, couleur, rythme, son et interactions simples.
- [ ] Appliquer les autres points 8 à 18 du brief : Émotions, Agenda, Communauté, Practical, Pros, aides humaines, Rituels.
- [ ] Vérifier les fonctions prioritaires de Soutien et l’ensemble des parcours concernés.
- [ ] Étendre la dimension carnet intime à toute l’application, pas seulement au Journal.
- [ ] Ajouter une esthétique sensorielle animée à Respirer : halo, lumière et matière vivantes.
- [ ] Valoriser « Se confier » dans Soutien avec une représentation distincte des autres entrées.
- [x] Vérifier les corrections demandées le 17 septembre : Start/citation sur iPhone, Agenda depuis Démarches, teintes des accès et du coffre.

## 22 septembre 2026
- [x] Captures mobile complètes de l'application (toutes les pages + scénarios onboarding) dans Files pour partage

## Étape 9 — professionnels et cérémonie
- [x] Reproduire les écrans 065–073 au plus près des captures et conserver les anciens écrans à part.
- [x] Relier le parcours professionnel, la progression de cérémonie et les fleurs libres/guidées à la logique existante.
- [x] Vérifier les retours, les neuf états et une proposition IA réelle.
- [ ] Éléments hors maquette : suppression définitive en attente de l’accord utilisateur.
- [ ] Activer appels et demandes de devis : coordonnées réelles des prestataires attendues.

## Étape 10 — textes, objets, livret et volontés
- [x] Présenter les quatre listes des écrans 074–079 avant le code.
- [x] Reproduire les six écrans et conserver les fonctions hors maquette accessibles.
- [x] Vérifier les propositions IA, les choix, le livret et le questionnaire.
- [ ] Suppression des éléments hors maquette : en attente d’accord utilisateur.

## Étape 11 — Mémoire : souvenirs et portrait
- [x] Présenter les quatre listes des douze écrans avant le code.
- [x] Reproduire les écrans 080–089, 108 et 109 ; préserver la peinture et les positions des parcelles.
- [x] Relier les parcelles à leur espace personnel et vérifier dépôt, détail, portrait et livre.
- [ ] Vérifier l’invitation connectée de bout en bout : session du compte utilisateur indisponible.
- [ ] Suppression des éléments hors maquette : en attente d’accord utilisateur.
