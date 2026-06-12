
# Plan de refonte Legato

Beaucoup de sujets dans votre message. Je propose de les regrouper en 6 lots cohérents et de les livrer dans cet ordre. Chaque lot est validable indépendamment.

## Lot 1 — Design system (fondations visuelles)

Objectif : une ambiance plus fraîche, sereine, rassurante, sans perdre le caractère.

- **Palette** : remplacer terracotta/bordeaux dominants par une base plus apaisée :
  - fond papier légèrement bleuté (`#F5F4F0` → `#F2F4F2`)
  - encre principale plus douce (gris-bleu profond plutôt que dusk brun)
  - accent chaud unique conservé pour les CTA émotionnels (terracotta désaturée)
  - accent froid sobre (sauge / bleu ardoise) pour l'espace concret
- **Typographie** : une seule serif d'inspiration (réf image fournie — type *Söhne Breit / Tiempos / GT Sectra*). Je proposerai `Fraunces` ou `Source Serif 4` (libres, proche du visuel), associée à **une seule** sans-serif (Inter) + mono discrète réservée aux eyebrows. Suppression du mix actuel serif italique + serif romain + mono dans le même bloc.
- **Hiérarchie** : 3 tailles de titre max, 2 tailles de corps, 1 eyebrow. Documenté dans `styles.css`.

## Lot 2 — Navigation globale

- **Barre du bas sans pictogrammes** : labels typographiques uniquement, séparés par un filet fin. Onglet actif souligné.
- **Renommages** :
  - "Être accompagné·e" → **"Prendre soin de soi"** partout (space, header, onboarding, sélecteur).
  - "Dossier" → **"Mes documents & volontés"** (label court possible : "Documents & volontés").
- **Bugs de navigation** : audit complet des `<Link>` et `useNavigate` (retour arrière, onboarding qui reboucle, "Lectures" → "Inspiration", etc.). Cartographier chaque écran et corriger les routes cassées.
- **Conditionnement par émotion** : l'émotion sélectionnée à l'onboarding `care` doit influencer Home (suggestions), Présence (qui contacter en priorité), Jardin (rituel proposé). Aujourd'hui c'est ignoré → câblage réel via `useLegato().feelings`.

## Lot 3 — Séparation stricte des ressources entre les deux espaces

Deux annuaires distincts, jamais mélangés.

- **Prendre soin de soi** (`/resources` accessible depuis `/home`) :
  - Thérapeutes, psychologues, psychiatres spécialisés deuil
  - Médecines douces (sophrologie, acupuncture, ostéopathie émotionnelle…)
  - Centres d'aide, lignes d'écoute, groupes de parole et communautés
- **Organiser & avancer** (`/resources` accessible depuis `/practical`) :
  - Pompes funèbres, marbriers, fleuristes funéraires
  - Notaires, avocats succession
  - Services de débarras / vidage de logement, déménageurs spécialisés
  - Administrations (mairie, CPAM, caisses de retraite)

Implémentation : `resources-data.ts` scindé en deux jeux + paramètre `space` sur la route, filtrage selon le contexte d'entrée. Plus aucun chevauchement.

## Lot 4 — Refonte des pages "liste" (Home, Parcours, Documents)

Inspiration : Empathy (https://empathy.com) — pages aérées, une action principale visible, le reste révélé progressivement.

- **Home** : passer d'une liste verticale dense à un "salon" :
  - un grand bloc d'accueil (météo intérieure + 1 action douce proposée selon l'émotion)
  - 2-3 cartes secondaires en grille respirante
  - suppression des doublons de typographie
- **Parcours** : hiérarchie en 3 niveaux clairs
  - vue d'ensemble : ligne de temps "Maintenant / Cette semaine / Plus tard / Terminé" en haut, 1 action urgente mise en avant
  - catégories collapsibles **toutes** présentes (aucune étape oubliée — audit exhaustif vs. réalité du deuil : démarches immédiates, cérémonie, administratif, succession, après)
  - **chaque** ligne cliquable vers `/parcours/$taskId` avec fiche complète (déjà existante, à étendre aux ids manquants)
- **Documents & volontés** : nettoyer la page (1 serif pour titres, 1 sans pour corps, mono uniquement pour métadonnées type "Ajouté le 12 juin"). Sections : *Documents officiels* / *Mes volontés* / *Partagé avec*.

## Lot 5 — Page Help développée et connectée

Aujourd'hui isolée. À transformer en véritable "espace d'aide immédiate" :

- accès depuis tous les écrans via un lien discret en bas
- contenu : crise (renvoi `/crisis`), corps (existe), nuits, alimentation, présence d'un proche, urgence administrative
- chaque carte mène à un mini-parcours (3-5 écrans guidés, mode "relais")
- relier explicitement à `/presence` (parler à quelqu'un) et `/resources` (espace adapté selon contexte)

## Lot 6 — Vérifications finales

- Parcourir tous les flux : onboarding → space → care/practical → toutes feuilles → retour
- Tester chaque bouton "← Retour" (plusieurs renvoient au prénom, à corriger)
- Vérifier que "Pour aller plus loin / Lectures / Audios / Vidéos" pointent vers des routes dédiées (à créer si absentes) et non vers `/inspiration`
- Cohérence des labels renommés sur toute la base

---

## Questions avant de démarrer

1. **Ordre** : OK pour démarrer par le **Lot 1 (design system)** ? C'est la fondation — sinon tout le reste sera refait deux fois.
2. **Référence Empathy** : je m'inspire de la sobriété / hiérarchie / palette froide-chaude. Vous voulez que je pousse jusqu'à leur registre très minimal, ou garder un peu plus de chaleur (un cran au-dessus en présence visuelle) ?
3. **Lectures / Audios / Vidéos** : ces sections doivent-elles être de vraies pages avec contenu éditorial (je proposerai des placeholders crédibles) ou simplement un cadre vide à remplir plus tard ?
