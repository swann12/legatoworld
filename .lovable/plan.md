Ta demande contient deux blocs très différents en volume. Je propose de la découper pour avancer proprement, sinon on va casser des choses ailleurs. Dis-moi ce que tu veux qu'on fasse en premier — je peux tout faire, mais pas dans une seule passe.

## Bloc A — Corrections transverses (rapide, 1 passe)

1. **Navigation cassée**
   - Bug "Retour" depuis sous-pages de RELAIS qui ramène à la première page → corriger les `<Link to="/onboarding">` codés en dur, utiliser l'historique du router (`router.history.back()`) ou un retour contextuel selon le mode.
   - Page `/help` : ajouter un bouton retour, et faire que "Accueil" ramène au mode courant (`/home?mode=relais` etc.) et non systématiquement à COCON.
   - Audit complet des `<Link>` dans `practical.*`, `help`, `resources.*`, `garden.*`, `compose.*` pour vérifier que chaque "← Retour" pointe au bon endroit.

2. **Traduction EN**
   - Identifier où vit le système i18n actuel (ou s'il n'existe pas — dans ce cas dire ce qu'on met en place : `lib/i18n.ts` simple avec un dictionnaire FR/EN).
   - Couvrir toutes les chaînes des écrans principaux.

3. **Mode "nuit" dark**
   - Ajouter un toggle (probablement dans `legato-state`), ajouter une classe `dark` sur `<html>`, dériver les tokens dans `src/styles.css` (`:root.dark { ... }`).
   - Adapter les composants `paper-card`, `ceramic`, `Halos`, etc.

4. **Page HELP — corrections rapides**
   - Plus de padding intérieur dans les encarts (`p-5` → `p-6` ou `px-7 py-6`).
   - Bouton retour visible.
   - Remplacer "JOURNAL INTIME" par "RESSOURCE ET ACCOMPAGNEMENT" dans RELAIS (à confirmer : où exactement — la liste `RELAY` de `/help` ou ailleurs ?).
   - Supprimer l'item "Paroles" ou le déplacer dans "Choses concrètes".
   - Remplacer les liens cassés (ex. "Quand le corps oublie de manger" → /no-words) par les nouvelles routes (voir Bloc B).

5. **Pages "Bienvenue" après sélection de mode**
   - Étoffer le contenu pour chaque mode (cocoon / anchoring / breath / relay) : une vraie explication du mode + ce qu'on va trouver dedans.

## Bloc B — Refonte module "Aide et accompagnement" (RELAIS uniquement)

Création de tout un nouveau parcours, **sans toucher aux autres modes ni aux écrans existants** :

### Structure de routes
```
src/routes/
  help.tsx                          (déjà là, à retravailler)
  help.corps.tsx                    (hub des 4 espaces CORPS)
  help.corps.manger.tsx             (Espace 1)
  help.corps.eau.tsx                (Espace 2)
  help.corps.habiller.tsx           (Espace 3)
  help.corps.nuits.tsx              (Espace 4)
  help.maison.tsx                   (hub MAISON)
  help.maison.attendre.tsx          (Espace 1)
  help.maison.aide.tsx              (Espace 2)
  help.maison.succession.tsx        (Espace 3)
  help.maison.affaires.tsx          (Espace 4)
  community.tsx                     (nouvelle page Communauté)
```

### Pour chaque espace
- En-tête Cormorant italic + sous-titre Inter Light, palettes exactes du brief.
- Cartes glassmorphism cochables avec persistance localStorage (`help-corps-manger`, etc.).
- Micro-animation "fleur" réutilisée du Jardin (à factoriser dans `components/legato/BloomFlower.tsx`).
- Messages de complétion doux ("C'est fait.", "Bien.", "C'est suffisant.").
- Liens contextuels vers Jardin / Journal / Sans mots quand le brief le demande.

### Mécaniques transverses du module
- Composant `<BackToHelp />` (bouton "← AIDE" en haut-gauche).
- Composant `<StepCard />` pour les parcours séquentiels (Eau, Manger section 2).
- Composant `<CheckableCard />` avec fleur + message bas écran.
- Pour "S'habiller" → notification matinale : la persistance d'une préférence locale + un texte explicatif (les vraies push notifications nécessitent un service worker + permission, je peux soit faire une vraie implémentation, soit juste persister la préférence et expliquer que ça arrive bientôt — à décider).

### Connexions entre modules
- Crochets discrets en bas de chaque espace (proposition Jardin, lien vers MAISON, etc.) tels que décrits.

## Ce qu'il me faut de toi avant de coder

1. **Priorité** : on attaque Bloc A en premier (corrections + nettoyage HELP), puis Bloc B en plusieurs sous-passes ? Ou tu veux tout en un, quitte à ce que la session soit très longue ?
2. **Mode nuit** : tu veux un toggle visible dans l'UI (où ? bouton dans la BottomNav ?) ou détection auto du `prefers-color-scheme` ?
3. **Notifications "S'habiller"** : vraies push web (avec demande de permission), ou simple préférence persistée + texte explicatif pour l'instant ?
4. **Traductions EN** : il existe déjà un système quelque part dans le code, ou je pars de zéro avec un petit dictionnaire ?
5. **Marketplace Legato** (cartes débarras, ménage, courses, etc.) : ce sont des cartes statiques pour l'instant (liens vers `/resources`) ou tu as déjà des données fournisseurs à brancher ?

Dis-moi par où on commence et je m'y mets immédiatement.