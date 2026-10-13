# Corrections : page logo, retours, accès visiteur, polices

## 1. Page d'ouverture avec le logo LEGATO (en premier)
- Remplacer le mot LEGATO et le symbole par les deux fichiers source envoyés, détourés (fond transparent) pour rester nets sur le fond bleu, à leur taille d'origine haute définition.
- Mettre le symbole en icône d'onglet du navigateur.
- Refaire le bouton « Entrer » exactement comme sur la capture de la maquette (forme, couleur, trait, taille du texte, position), en relisant la capture 001 avant de coder.
- Ne pas toucher à l'animation (vidéo, vitesse, moment d'apparition du logo).

## 2. Retours à la page précédente
- Le bouton « Retour » renverra à la page d'où l'on vient vraiment (ex. Dormir → Écouter, lire, en parler → En parler → Retour = Écouter, lire, en parler, et non Communauté).
- Règle : s'il existe une page précédente dans la visite, on y revient ; sinon (lien ouvert directement), on revient à la page parente prévue.
- Appliquer cette règle une seule fois dans l'en-tête commun, pour corriger tous les écrans d'un coup.
- Vérifier ensuite des parcours croisés dans chaque espace (Soutien, Démarches, Mémoire, Communauté, Aujourd'hui) et lister ceux corrigés.

## 3. Option « Visiteur »
- Sur l'écran de choix d'accès, ajouter un lien discret « Continuer en visiteur » sous « Créer mon espace » et « J'ai déjà un compte » (pas de second bouton plein).
- Le visiteur entre directement dans l'application ; ses choix restent sur son téléphone. Il pourra créer un compte plus tard.

## 4. Polices qui saccadent au chargement
- Précharger les polices principales et afficher le texte sans saut (police de secours aux proportions proches), retirer les polices chargées mais inutilisées.
- Vérifier qu'il n'y a plus de clignotement des titres à l'ouverture des pages.

## Détails techniques
- Logos : magick pour détourer le blanc, puis lovable-assets ; remplacer les imports de `logo-legato.png` / `logo-symbole.png` dans `src/routes/index.tsx` ; favicon carré dans `public/favicon.png`.
- Retour : dans `PageHeader`/layouts DS (et `BackLink`), utiliser `router.history.canGoBack()` → `history.back()`, sinon `Link` vers `back` en repli.
- Visiteur : réutiliser le mode invité existant de `start.tsx` / legato-state s'il existe, sinon un indicateur local.
- Polices : `rel=preload` pour Typekit/Google, `display=swap`, nettoyer Inter/Space Mono si inutilisés, `size-adjust` sur la police de secours.
- Vérification au format 393 × 774.
