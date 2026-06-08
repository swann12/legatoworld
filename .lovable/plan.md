
# Refonte intégrale de Legato — plan d'exécution

Le brief est immense (25 chapitres, refonte UX/UI complète + nouvelles fonctionnalités). **Aucune session ne peut tout livrer en une passe sans régressions massives.** Je propose un découpage en 6 vagues, livrées l'une après l'autre, chaque vague étant testable seule.

À chaque fin de vague je m'arrête, tu valides, on enchaîne.

---

## Préservé tel quel (zéro modification)

- Animation florale d'introduction plein écran (`/` → jardin qui fleurit)
- Page logo Legato + bouton "Entrer"

Tout le reste est repensé.

---

## Vague 1 — Fondations visuelles & architecture (1 session)

**Objectif : casser la fadeur beige, poser la nouvelle direction artistique, restructurer la navigation en 5 onglets.**

1. **Nouvelle palette + tokens** (`src/styles.css`)
   - Sortir du tout-beige : base claire lumineuse + accents éditoriaux assumés (un bleu nuit profond, un terracotta doux, un vert salvia, un crème chaud), chacun activé selon le contexte/mode.
   - Contrastes renforcés, gradients atmosphériques, ombres plus délicates.
   - Tokens dark mode prêts (activés vague 2).
2. **Typographie éditoriale renforcée** : hiérarchie plus tranchée (display Cormorant pour les titres, Inter Light pour le corps, micro-caps pour les eyebrows). Marges plus généreuses.
3. **Nouvelle navigation 5 onglets** (BottomNav) :
   `Aujourd'hui · Jardin · Journal · Avancer · Présence`
   Suppression des accès actuels redondants.
4. **Nouvel accueil `/home`** ultra-simplifié :
   - Bonjour {prénom}
   - 2 portes : "Être accompagné·e" / "Avancer concrètement"
   - 1 seule suggestion du jour (contextuelle au mode)
   - Accès discret Jardin + Présence
5. **Audit navigation** : tous les retours pointent au bon endroit (correction des `<Link to="/onboarding">` codés en dur).

---

## Vague 2 — Onboarding, modes & deux portes (1 session)

1. **Onboarding réécrit** (3 étapes courtes, prénom = Swann par défaut, FR naturel).
2. **4 modes réellement différenciés** :
   - Cocon : ultra-immersif, 1-2 actions, fond enveloppant.
   - Ancrage : structure nette, repères.
   - Souffle : aérien, sons, animations.
   - Relais : actions visibles, raccourcis proches/pros.
   Chaque mode a son propre layout d'accueil, pas juste une couleur.
3. **Mode nuit (dark)** : toggle dans le profil/settings.
4. **Page "Être accompagné·e"** : hub regroupant Présence IA, Journal, Sans mots, Jardin, Ressources, Rituels, Groupes.
5. **Page "Avancer concrètement"** : hub regroupant Premières démarches, Cérémonie, Documents, Pros, Volontés.

---

## Vague 3 — Présence IA fil conducteur + Journal + Sans mots (1 session)

1. **Présence IA** accessible partout (dock flottant discret) : texte + voix, distingue écoute / aide décision / organisation / relais humain.
2. **Journal intime** refondu : page éditoriale, sauvegarde auto, textarea auto-grow, dictée, photo optionnelle, amorces facultatives, recherche, association à une parcelle.
3. **Sans mots** enrichi : nouveaux paysages sonores, respiration visuelle guidée, transitions douces entre séquences, suggestions IA de continuité.

---

## Vague 4 — Jardin & souvenirs & éditeur de composition (1 session)

1. **Jardin vue d'ensemble** plus organique, intégré au fond, parcelles vivantes.
2. **Parcelle individuelle** : composition florale évanescente, souvenirs + compositions associées, animations discrètes (oscillation, insecte, reflet).
3. **Ajout de souvenir** repensé : import/enregistrement → mots optionnels → enregistrement → proposition douce de composer.
4. **Éditeur de composition** simplifié :
   - Toolbar fixe : Éléments · Annuler · Refaire · Exporter · Valider · Quitter
   - Manipulation tactile native (drag, pincement, rotation 2 doigts)
   - Pas de répétition auto, contours progressifs, opacité simple.
   - Placement intelligent basique (couronne, élément posé sur fleur).
   - Export HD, fond blanc, association au souvenir.

---

## Vague 5 — Aide concrète (Empathy-like) progressif (1 session)

1. **Plan personnalisé** (question initiale facultative).
2. **Écran "On avance d'un seul pas"** : 1 priorité, 1 prochaine étape, options déléguer/reporter.
3. **Checklist progressive** par catégorie, révélation progressive (pas de liste interminable).
4. **Catégories** : Premiers jours, Organisation obsèques, Informer, Documents (import/scan), Comptes & abonnements, Budget, Aides & droits, Succession, Logement.
5. **Trouver une aide** (annuaire pros) : 3 suggestions pertinentes en premier, filtres location/budget/dispo, fiche claire, contact/devis/RDV.
6. **Proches & relais** : invitation, rôles simples, délégation de tâches.
7. **Mes volontés** : espace distinct dans profil, partage sécurisé.

---

## Vague 6 — IA esthétique & symbolique + livret + finitions (1 session)

1. **Aide IA cérémonie** : "Parlez-nous de cette personne" → propositions fleurs/musiques/textes/déroulé, en 3 degrés d'aide.
2. **Livret de cérémonie** assisté IA : photo, format, texte, poème, musiques, déroulé, intervenants, export PDF.
3. **Rituels et gestes de mémoire** : catalogue respectueux par culture/durée/contexte.
4. **Ressources culturelles** personnalisées (films, livres, podcasts) avec sections éditoriales.
5. **Traductions EN** complètes via dictionnaire i18n.
6. **Pass final UX** : audit accessibilité, réduire animations, désactiver sons, chargements doux, suppression débordements/scrolls inutiles.

---

## Détails techniques (section pour développeur)

- **Stack** : TanStack Start v1, React 19, Tailwind v4 (tokens dans `src/styles.css` via `@theme`), Lovable Cloud (Supabase) déjà branché.
- **Routes nouvelles** : `today.tsx`, `accompany.tsx` (hub sensible), `forward.tsx` (hub concret), `wishes.tsx` (refondu), `documents.tsx`, `accounts.tsx`, `budget.tsx`, `aids.tsx`, `succession.tsx`, `housing.tsx`, `pros.tsx`, `pros.$category.tsx`, `circle.tsx` (proches), `booklet.tsx` (livret), `rituals.tsx`.
- **Persistance** : tables Supabase pour souvenirs, compositions, journal, tâches, documents, proches, volontés. RLS + GRANT à chaque table.
- **IA** : Lovable AI Gateway (`google/gemini-3-flash-preview` par défaut) pour Présence + assistance cérémonie + suggestions + livret.
- **Migrations DB** : créées vague par vague (pas tout en V1).
- **Pas de tout casser** : on garde les routes existantes accessibles tant que leur remplaçante n'est pas live, puis on supprime/redirige.

---

## Ce qu'il me faut de toi avant de démarrer la Vague 1

1. **Validation du découpage en 6 vagues** (sinon dis-moi quelles vagues fusionner/réordonner).
2. **Direction couleur** : tu veux que je te propose 2-3 palettes visuelles (swatches) avant de coder, ou je tranche en suivant le brief (base claire + accents éditoriaux contextuels) ?
3. **Données existantes** : on conserve les souvenirs/compositions/journal déjà créés dans la version actuelle, ou table rase ?
4. **Priorité absolue si une seule vague devait sortir cette semaine** : Vague 1 (refonte visuelle + nav) ou Vague 5 (aide concrète Empathy-like) ?

Réponds-moi sur ces 4 points et j'attaque la Vague 1 immédiatement.
