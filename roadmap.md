# Reprise UX/UI Legato

## Étape D4 — sons de bien-être (ajouts-4)
- [x] Présenter les quatre listes D026–D032 avant le code et conserver l’existant.
- [ ] Reproduire les sept écrans, relier les boutons et garder un lecteur commun pendant la navigation.
- [ ] Fournir des fichiers de démonstration originaux, minuteur audio natif, mélange et favoris locaux.
- [ ] Vérifier les parcours, les réglages et les sauvegardes ; préciser la limite de vérification téléphone verrouillé.

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
