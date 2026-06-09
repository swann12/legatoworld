# Plan de refonte — 15 points regroupés en 6 chantiers

Votre liste touche à la fois la **typographie globale**, l'**architecture des parcours** (aides concrètes vs accompagnement), la **logique produit** (qui décide de l'urgence, suivi d'avancement), et la **qualité visuelle page par page**. Pour éviter une refonte brouillonne, je propose d'attaquer dans cet ordre — chaque chantier est validable indépendamment.

---

## Chantier 1 — Système visuel global (points 1, 8, 11, 13)

**Typographie**
- Remplacer la sans-serif actuelle (trop large, peu élégante) par une sans plus fine et resserrée : **Inter Tight** ou **Söhne-like** (test : *Geist* ou *General Sans*). Garder la serif existante pour les titres.
- Tailles fixes : H1 32 / H2 22 / corps 14 / eyebrow mono 10.

**Palette nuancée**
- Bordeaux décliné en 4 tons (très clair pour fonds, moyen pour accents, profond pour CTA, sombre pour texte sur clair).
- Incorporer 2 nuances tirées de l'animation florale d'entrée (à identifier — probablement un rose poudré + un vert sauge très désaturés) comme **accents secondaires uniquement**, jamais comme surfaces dominantes.

**Bottom nav**
- Marges latérales : passer de `px-2` à `px-6`, réduire à 4 items max par espace (au lieu de 5), icônes plus fines (stroke 1.2), label mono 9px.

**Logo / sigle**
- Ajouter un sigle « L » discret (mono, 11px) en haut à gauche dans `ScreenHeader` et dans `__root.tsx`.

---

## Chantier 2 — Refonte de la page `/start` (point 2)

- Unifier à **2 tailles typographiques** maximum (titre + corps).
- Bordeaux uniquement en **filets + un seul CTA**, pas en surface pleine.
- Hiérarchie : 1 phrase d'accueil → 2 portes (psy / concret) → 1 lien secondaire.

---

## Chantier 3 — Onboarding (points 3, 14)

- **Étape 2** : refonte des cards de sélection — état sélectionné **explicite** (bordure bordeaux 2px + fond crème, pas juste un changement subtil), textes raccourcis à 1 ligne max.
- Couleurs revues : pas de bordeaux sur fond terracotta, séparer chromatiquement.
- **« Préparer mes volontés »** retiré du flux psy, conservé uniquement dans le flux concret.

---

## Chantier 4 — Architecture des aides (points 4, 5, 6, 7, 9, 10)

C'est le chantier le plus structurant. Refonte logique :

### Différenciation stricte des deux espaces
| Aides concrètes | Accompagnement psychologique |
|---|---|
| Pompes funèbres, notaires, fleuristes, mairie, banque | Thérapeutes, psy, médecine douce, groupes de parole |
| Démarches administratives | Présence, écriture, respiration |

### Plus de "qu'est-ce qui est urgent ?"
L'app calcule la prochaine étape selon : (a) délais légaux (déclaration < 24h, etc.), (b) étapes déjà cochées/déléguées, (c) date du décès. L'utilisateur ne choisit pas la priorité — il la **reçoit**.

### Suivi d'avancement (à inspirer d'Empathy / Inmemori)
Pour chaque démarche : **À faire / En cours / Délégué à [nom] / Fait**. Vue récapitulative `/plan` :
- ✅ Ce qui a été fait
- ⏳ En cours
- 👤 Délégué à un proche
- ⚠️ Ce qu'il reste (avec deadlines)
- ❓ Questions fréquentes par étape

### Exécution, pas seulement cochage (point 7)
Chaque étape ouvre une fiche : *pourquoi c'est nécessaire*, *qui contacter*, *documents à préparer*, *modèle de courrier/email* si pertinent, *bouton « déléguer à un proche »*.

### Résoudre le bug `/practical` ↔ `/home` (point 9)
Audit en début de chantier — probablement un conflit de navigation entre `BottomNav` (priorité plan) et redirect espace.

---

## Chantier 5 — Refonte pages accompagnement psy (point 15)

- **`/accompany`** : retravailler la composition (actuellement trop linéaire), introduire un rythme visuel + un visuel doux (halo floral).
- **`/practical/ceremony` et `/practical/atmosphere`** : ces deux pages appartiennent en réalité au **concret**, pas au psy — à déplacer / fusionner dans le chantier 4. Réparer les boutons cassés d'Atmosphère.
- **`/memories`** : aligner sur le système visuel (cards `.surface`, eyebrow mono, typo unifiée).
- **`/circle`** (point 12) : refonte complète — qu'attendez-vous de cette page ? (cf. question ci-dessous)

---

## Chantier 6 — Page `/circle` (point 12)

Avant de refaire, j'ai besoin de savoir ce qu'elle doit faire :
- Liste de proches à qui déléguer des démarches ?
- Espace de partage de souvenirs ?
- Carnet de contacts pour la cérémonie ?
- Les trois ?

---

## Ordre d'exécution proposé

1. **Chantier 1** (système visuel) — fondations, impacte toutes les autres pages
2. **Chantier 4** (architecture aides) — la plus grosse refonte logique
3. **Chantier 3** (onboarding) — rapide
4. **Chantier 2** (start) — rapide
5. **Chantier 5** (pages psy)
6. **Chantier 6** (circle) — après vos réponses

---

## Questions avant de démarrer

1. **Chantier 6** : que doit faire `/circle` exactement ?
2. **Police sans-serif** : préférence entre *Inter Tight*, *General Sans*, *Söhne-substitute* (Geist) ? Ou je choisis ?
3. **Délais légaux** (chantier 4) : ok pour que j'intègre les vrais délais français (déclaration mairie 24h, obsèques 6 jours, succession 6 mois, etc.) ?
4. **Ordre** : ok pour démarrer par le chantier 1 + 4 en parallèle, ou vous préférez tout séquentiel ?

Validez le plan (ou ajustez) et je commence.