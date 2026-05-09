## Vision

Faire de `/practical` un véritable compagnon d'organisation : doux, lisible, jamais bureaucratique. Toujours relié à l'IA (texte + voix) et au jardin / composition florale. Cinq grands chantiers, sans toucher au schéma de données ni casser l'existant.

## Chantier 1 — Refonte de l'index « Aides concrètes »

Fichier : `src/routes/practical.tsx`

- Nouveau header sensible, court, avec une seule intention par mode (`modeProfile(mode)` réutilisé) :
  - Cocon → « On avance d'un seul pas. »
  - Ancrage → « Tout est là, dans l'ordre. »
  - Souffle → « Composer un adieu qui lui ressemble. »
  - Relais → « D'autres mains peuvent porter avec vous. »
- Suppression de la liste verticale figée. À la place : 4 grandes cartes-portes, ordonnées selon le mode :
  1. **Démarches** (administratif + premiers jours)
  2. **Cérémonie** (déroulé, lieu, intervenants)
  3. **Atmosphère** (fleurs, objets, textes, musiques)
  4. **Partage & relais** (envois, proches, pros)
- Une bande discrète en bas : « Parler à Lovely » (lien vers `/presence` + bouton micro) toujours présente.
- Bandeau « Budget » repliable, doux, pas en premier plan.

## Chantier 2 — Sous-routes guidées

Création de routes dédiées (chacune courte, une seule décision à la fois) :

- `src/routes/practical.steps.tsx` — Démarches après décès, cochables, pas de tableau.
- `src/routes/practical.ceremony.tsx` — Choix du déroulé, lieu, intervenants, religion / civil.
- `src/routes/practical.atmosphere.tsx` — Hub vers fleurs, objets, textes, musiques.
- `src/routes/practical.flowers.tsx` — **Composition florale simplifiée** réutilisant les éléments de `src/lib/elements.ts` (familles `florale`, `feuillage`). Canvas réduit (bouquet / couronne / ambiance), preset palettes. Export image + bouton « Envoyer au fleuriste ». S'appuie sur le moteur existant de `compose.$zone.tsx` extrait dans `src/components/legato/MiniComposer.tsx`.
- `src/routes/practical.objects.tsx` — Cercueil, urne, plaque, livret, objets rituels. Affiche des cartes avec image, courte description, fourchette de prix indicative, lien sortant (`rel="noopener"`) vers références réelles + 2-3 alternatives par budget.
- `src/routes/practical.texts.tsx` — Textes, poèmes, lectures, musiques. Suggestions IA via `suggestInspiration` déjà existant + curation locale.
- `src/routes/practical.booklet.tsx` — Générateur de livret (HTML imprimable + export PNG/PDF via `window.print()` stylé `@media print`). Champs : photo, prénom, dates, textes, musiques, déroulé.
- `src/routes/practical.share.tsx` — Récap des choix faits + `mailto:` pré-rempli (proches / pompes funèbres / officiant).
- `src/routes/practical.budget.tsx` — Saisie d'un budget indicatif (trois paliers : essentiel / équilibré / élaboré). Stocke en localStorage et filtre les suggestions des autres écrans.

Chaque sous-route utilise `Shell` + `ScreenHeader` + un fil d'Ariane minimal vers `/practical`.

## Chantier 3 — IA proactive et confidente toujours accessible

- Nouveau composant `src/components/legato/ConfideDock.tsx` : pastille flottante en bas à droite (taille 56 px, halo doux, animation `breathe`) présente sur toutes les routes `/practical/*` et `/wishes`. Tap → ouvre une `Sheet` (shadcn) avec deux entrées : *Écrire* (textarea) et *Parler* (bouton micro).
- Reconnaissance vocale via Web Speech API (`window.SpeechRecognition || window.webkitSpeechRecognition`), `lang="fr-FR"`, fallback texte si absent. Pas de dépendance npm.
- Une fois la confidence saisie, appel d'une nouvelle Server Function `src/lib/practical-ai.functions.ts` → `suggestPractical({ description, mode, budget, step })` qui renvoie des **suggestions structurées** (sections : fleurs, musiques, textes, objets, lieu, organisation) via `google/gemini-2.5-flash` avec tool-calling JSON. Réutilise `LOVABLE_API_KEY`.
- Les suggestions s'injectent dans la sous-route active (badge « inspiré de ce que vous venez de dire »).

## Chantier 4 — Volontés enrichies

Fichier : `src/routes/wishes.tsx`

- Sections distinctes : ambiance, fleurs (lien vers mini-compositeur), musiques, textes, objets, ce que je veux / ne veux pas.
- Bouton « Partager avec un proche » → génère un `mailto:` avec lien lecture seule (token stocké en localStorage pour le MVP visuel ; pas de persistance serveur).
- Pastille `ConfideDock` aussi présente.

## Chantier 5 — Détails techniques transverses

- `src/components/legato/MiniComposer.tsx` : extraction du noyau drag/zoom de `compose.$zone.tsx` (canvas 3:4 → 4:3 paysage pour bouquet), API `<MiniComposer presets="bouquet|couronne|ambiance" onExport={(blob)=>...} />`.
- `src/lib/practical-store.ts` : localStorage léger pour budget, choix de cercueil, palette florale, textes retenus, brouillon livret. Aucune table Supabase.
- `src/styles.css` : ajouter `.dock-halo`, `.print-booklet` (règles `@media print`), variantes de carte `.ceramic-warm` pour les cartes objets/références.
- Tous les liens externes (références cercueils/fleurs/objets) : composant `<ExternalRef>` neutre, `target="_blank" rel="noopener noreferrer"`, label « ressource externe » + petite icône. Pas de logos commerciaux.
- Modes appliqués via `modeProfile(mode)` : densité (nombre de cartes visibles), halo, ordre des 4 cartes-portes. Mode **Relais** met « Partage & relais » en tête + suggestions de pros / cercles.
- Routes ajoutées au `routeTree.gen.ts` automatiquement par le plugin Vite.
- Aucune nouvelle dépendance npm. Aucune migration. Pas d'appel direct au modèle côté client (toujours via Server Function).

## Hors scope (pour rester focalisé)

- Persistance serveur des volontés / partages (token réel, RLS) — restera côté localStorage cette passe.
- Génération PDF côté serveur (on utilise `window.print()` stylé).
- Paiements / commandes réelles d'objets.

## Ce que l'utilisateur verra

- Une page `/practical` calme, 4 portes claires hiérarchisées par mode.
- À chaque étape : suggestions IA personnalisées + pastille pour parler ou écrire à tout moment.
- Un mini-compositeur floral exportable et partageable.
- Des références concrètes (objets, fleurs, cercueils) avec fourchette de prix.
- Un livret de cérémonie imprimable.
- Un budget pris en compte partout, sans culpabilisation.
- Des volontés personnelles enrichies, partageables.

Dites-moi si je peux lancer ces 5 chantiers tels quels, ou si vous voulez resserrer le périmètre (par exemple démarrer par 1 + 3 + 4 d'abord).