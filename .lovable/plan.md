# Plan de refonte — Vague 2

Toutes vos instructions, regroupées en 6 lots exécutés dans l'ordre. Après votre approbation, j'exécute tout d'affilée sans poser d'autre question.

## Lot A — Bugs cliquables (bloquant)
- **Respiration** : page dédiée `/care/respirer` avec animation guidée (cercle qui respire 4-7-8), pas juste un lien mort.
- **Dépôts Jardin** : chaque parcelle/élément à déposer devient une route fonctionnelle (`/care/garden/$zone` déjà là mais boutons morts → fix les onClick et navigations manquantes).
- **Corps (Help)** : boutons Eau / S'habiller / Manger / Nuits cliquables → contenu réel par page.
- **Administratif** : boutons des étapes pratiques mènent à `practical.tasks.$id` réel, plus de cul-de-sac.

## Lot B — Page Démarches dynamique et différenciée
- Même structure aérée que Care : grand titre éditorial, tuiles pastel équilibrées (sardine, butter, blush, ochre, terracotta en accent), pas de répétition de la même couleur.
- Bloc "Aujourd'hui" : 1 priorité claire + progression chiffrée (style référence "42%" / "68%").
- Tuiles thématiques : Tâches, Documents, Pros, Cérémonie, Volontés — chacune sa couleur unique.
- Bordeaux réservé aux moments d'ancrage (1 tuile max par écran).

## Lot C — IA Présence enrichie
- **Mode libre** (par défaut) : chat ouvert "confiez-vous", style markdown, sans cadre rigide.
- **Mode guidé** : prompts contextuels selon situation.
- **Vocal** : bouton micro qui dicte dans la prompt + lecture des réponses (Web Speech API).
- **IA Rituels** : générateur qui propose 3 rituels personnalisés avec explication culturelle (origine, sens, déroulé) — bouton "Proposer un rituel pour moi".
- **Bibliothèque rituels** enrichie et reclassée : par moment (matin, soir, anniversaire, lâcher-prise) ET par culture (Asie de l'Est, Afrique de l'Ouest, Amérique latine, Europe du Nord, Moyen-Orient, peuples premiers, laïque/contemporain). Chaque carte ouvre une fiche : origine + sens + déroulé + adaptation possible.

## Lot D — Help repensé en accompagnement
Plus de liste plate "eau / s'habiller / manger". Help devient un **parcours du jour adaptatif** :
- "Comment va votre corps aujourd'hui ?" → 3 curseurs courts (énergie, sommeil, faim).
- Génère un petit programme du jour : 2-3 gestes concrets et personnalisés.
- Carte "Ancrage 2 min" cliquable → animation guidée.
- Carte "Bouger doucement" → suggestion courte adaptée à l'énergie déclarée.
- Schéma visuel : silhouette qui s'éclaire selon les zones prises en charge.

## Lot E — Profil + Êtres archivés + Resources/Pros séparés proprement
- **Profil** refait : avatar, prénom, espace actif, paramètres essentiels, mode invité visible, déconnexion.
- **Êtres aimés** : nouvelle page `/profile/proches` avec tous les êtres ajoutés/archivés, fiche par être (nom, lien, date, médias déposés, possibilité de réactiver).
- **Resources** : devient un hub qui se filtre automatiquement selon l'espace (Soutien → thérapeutes, groupes, lectures / Démarches → pompes funèbres, notaires, juristes). Plus de "deuil animalier" mélangé avec ressources pour une personne sauf si l'être perdu est un animal.
- **Pros** dans Démarches = sous-vue dédiée du même hub, jamais doublonné.

## Lot F — Wording, couleurs, citations, détails
- **Start** : baseline "Préparer un adieu, garder une présence." + sous-ligne "Composer une cérémonie, écrire ce qui compte, faire vivre le souvenir. À votre rythme." (déjà fait, je vérifie) + mention "En mode invité·e, rien n'est conservé" (déjà fait).
- **Onboarding** : plus aéré, retrait des libellés inutiles, micro-illustrations légères sur 2-3 étapes, transitions plus douces.
- **Émotions** : grille de pastilles colorées (référence "How are you feeling today" : sardine, butter, blush, ochre, bordeaux léger, terracotta) sur fond paper, comme vos images.
- **Dates** : exemple "1 an de Léa" sur fond beige `whisper` (pas coloré). Filtrage logique : fête des pères seulement si relation = père.
- **Dépôts Jardin** : palette équilibrée — 1 couleur par type de dépôt (voix=sardine, écrit=butter, photo=blush, objet=ochre, lettre=terracotta).
- **Citations pleine page** : composant `<QuoteSplash />` réutilisable, intégré aux moments clés (entrée d'espace, fin d'un rituel, fin de journée).
- **Wording** : retrait de "Des gestes courts, rien d'autre.", "Une lettre libre", autres formules sèches. Remplacés par formulations personnelles et claires (à valider à l'usage).
- **Bottom nav** : espacements parfaitement réguliers (grid-cols-5 strict), icônes mêmes proportions, "Aujourd'hui" centré et légèrement plus marqué, label sous l'icône, pas de bordures lourdes.
- **Crisis** : refonte complète — fond `whisper` neutre, hiérarchie : 1) bouton appel d'urgence pleine largeur, 2) 3 gestes immédiats (respirer / appeler un proche / écrire), 3) numéros vérifiés FR/BE/CH/CA, 4) sortie douce vers Présence IA.
- **Tasks vs Practical** : Practical = vue d'ensemble Démarches (tuiles thématiques). Tasks = checklist active du jour, plus dynamique (progression visuelle, drag pour cocher, états to-do / en cours / fait).
- **Vault** : refonte esthétique sur fond sardine léger, catégories en cartes nettes, ajout document depuis chaque catégorie.

## Détails techniques
- Composants créés/refactorés : `QuoteSplash`, `BreathingCircle`, `RitualCard` (avec explication), `EmotionPill`, `BodyToday`, `ArchivedLovedOnes`, `ResourcesHub`, nouveau `BottomNav` grid strict.
- Routes ajoutées : `/care/respirer`, `/profile/proches`.
- Filtrage dates : update `lib/sensitive-dates.ts` pour ne sortir que les dates pertinentes selon `lovedOneRelation`.
- IA : utilisation Lovable AI Gateway (`google/gemini-3-flash-preview`) via `createServerFn`, route `/api/chat` pour le mode libre.
- Voix : `webkitSpeechRecognition` + `speechSynthesis` côté client uniquement (pas de SSR).
- Wording revu globalement : passage en relecture pour traquer les formules sèches/floues.

## Ce que je ne fais PAS dans cette vague
- Tests automatisés.
- Logique de paiement.
- Notifications push.

Validez le plan et j'exécute lot A→F sans interruption.
