## Refonte Legato — direction éditoriale & deux espaces

### 1. Direction visuelle (fondations)

**Typographies** (3 max, déjà chargées) :
- Serif éditoriale (titres) — celle utilisée sur l'écran bordeaux d'entrée
- Sans-serif lisible (texte, boutons, formulaires)
- Mono discrète (micro-labels, dates, catégories)

**Échelle typographique réduite** — 6 niveaux uniquement :
display / page / section / card / body / micro.

**Palette assumée** dans `src/styles.css` :
- Crème lumineux (fond principal) + paper plus clair
- Bordeaux profond (espace émotionnel, CTA forts)
- Bleu nuit (espace organiser, structure)
- Rouge chaleureux, rose franc, jaune solaire, bleu vif — **accents fonctionnels**
- Encre profonde pour le texte (pas gris pâle)

**Règles** :
- Suppression des halos, dégradés flous, fonds beiges uniformes
- Coins arrondis modérés (12–18px), jamais 22–48px
- Bordures fines uniquement quand utiles
- Beaucoup de blanc, alignement strict, grille régulière
- Couleur = repère fonctionnel (carte prioritaire, espace, statut), pas décor permanent

### 2. Architecture UX — deux espaces séparés

```
/start         → animation florale (inchangée)
/index (logo)  → logo Legato (inchangée)
/onboarding    → prénom + ressenti (simplifié)
/space         → NOUVEAU : "Comment souhaitez-vous être accompagné·e aujourd'hui ?"
                  ├── Être accompagné·e  → /home (espace émotionnel, crème + bordeaux)
                  └── Organiser et avancer → /practical (espace pratique, crème + bleu nuit)
```

Bascule discrète entre espaces depuis l'en-tête (petit lien mono).

### 3. Écrans à refaire (priorités)

**A. Page de choix `/space`** (nouvelle)
Deux grandes cartes pleine largeur, aplats colorés assumés (bordeaux / bleu nuit), titre serif, une phrase, un CTA chacune.

**B. Accueil ÊTRE ACCOMPAGNÉ·E `/home`**
- Logo Legato discret en haut, eyebrow mono
- Titre serif + phrase courte
- Bloc unique « De quoi auriez-vous besoin maintenant ? » → 8 actions claires (parler, écrire, respirer, jardin, souvenir, rituel, contacter, me guider)
- Personnalisation : ordre selon le ressenti d'onboarding
- Suppression du sélecteur de modes flou
- Accès secondaires : journal, rituels, ressources
- Nav 4 onglets : Accueil · Jardin · Souvenirs · Présence

**C. Accueil ORGANISER ET AVANCER `/practical`**
- Titre « Avançons une étape à la fois. »
- Sous-titre « Nous avons rassemblé ce qui mérite votre attention aujourd'hui. »
- **Carte priorité principale** (aplat bleu nuit) : titre tâche, explication, durée, docs requis, CTA Commencer + liens Déléguer / Question
- Résumé compact : à faire · en cours · délégué · documents manquants · prochaine échéance
- Nav 4 onglets : Accueil · Parcours · Services · Dossier

**D. `/parcours` (nouveau)** — liste filtrable (à faire / en cours / délégué / en attente / terminé). Une ligne = nom · catégorie · échéance · statut · responsable · action.

**E. `/presence`** — Titre « Parler à une présence », phrase, 6 actions (écrire, parler, contacter un proche, trouver un groupe, contacter un professionnel, lignes d'écoute). Très épuré.

**F. `/garden`** — conserver le principe, rester dans l'espace émotionnel uniquement. Nettoyer la grammaire visuelle (suppression halos, cohérence éditoriale).

**G. `/memories` (Souvenirs)** — promu dans nav espace émotionnel. Liste/grille éditoriale, peu de chrome.

**H. `/practical/ceremony`** — checklist claire : lieu, date, officiant, cercueil/urne, fleurs, musiques, textes, photos, objets, invitations, livret, budget, validation. Option « Me proposer une première version » (placeholder IA, déjà branché).

**I. `/practical/atmosphere`** — formulaire de description, options (décrire, photo, budget, sensibilité, me laisser guider), puis sélection fleurs/textes/musiques/couleurs/objets/rituels/livret.

**J. Services séparés**
- `/practical/services` : pompes funèbres, notaires, fleuristes, marbriers, officiants, imprimeurs, lieux, admin
- `/resources` (déjà existant) : psychologues, associations, groupes, lignes d'écoute, communautés
- Jamais mélangés.

### 4. Composants partagés à introduire

- `<EditorialHeader>` : eyebrow mono + logo discret + titre serif + sous-titre
- `<PriorityCard>` : aplat coloré + serif + métadonnées + CTA principal
- `<ActionList>` : liste éditoriale sobre (numéro mono, titre serif italic, body, flèche)
- `<SpaceNav>` : nav 4 onglets, picto + label court, version Émotionnel et version Pratique

### 5. Ce qui reste intact

- `/start` (animation florale)
- Page logo Legato
- Symbole Legato (apparaît discrètement dans les en-têtes intérieurs)
- Page bordeaux « Préparer un adieu, garder une présence. » — référence identitaire

### 6. Détails techniques

- Mise à jour `src/styles.css` : nouveaux tokens couleur (bleu-nuit, rouge-chaleureux, rose-franc, jaune-solaire, bleu-vif), suppression définitive des classes glass/ceramic encore référencées, échelle typo unifiée
- Nouveau fichier `src/routes/space.tsx` (déjà existant — à refaire entièrement) en page de choix
- Nouveau fichier `src/routes/parcours.tsx`
- Refonte `src/routes/home.tsx`, `practical.index.tsx`, `presence.tsx`, `garden.index.tsx`, `memories.tsx`, `practical.ceremony.tsx`, `practical.atmosphere.tsx`
- `BottomNav` devient conditionnelle selon l'espace (lecture depuis `useLegato`)
- Onboarding : à l'issue, redirection vers `/space` au lieu de `/home`

### 7. Ordre d'exécution (livré en une passe)

1. Fondations CSS (tokens, typo, suppression halos résiduels)
2. `/space` (page de choix) + redirection onboarding
3. Nav conditionnelle (BottomNav espace émotionnel vs pratique)
4. Accueils `/home` et `/practical`
5. `/presence`, `/parcours`
6. `/garden`, `/memories`
7. `/practical/ceremony`, `/practical/atmosphere`
8. Vérification build + parcours rapide

### Hors scope (pas touché tant que la direction n'est pas validée)

Help (corps), crisis, wishes, resources détaillées, compose, dates, community, vitrine, presentation, no-words, inspiration, booklet, flowers, objects, texts, share, steps.
