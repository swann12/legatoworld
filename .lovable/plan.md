# Refonte cohérence globale — un seul système, appliqué partout

Vous avez raison : les tokens ont été posés mais les pages n'ont pas été ramenées au même langage. Je traite ça en **un seul chantier transversal**, pas page par page, pour qu'il n'y ait plus de divergence.

## 1. Système typographique resserré (réponse aux points 1, 2, 11)

**Inter est trop large.** Bascule sur **Inter Tight** (Google Fonts) — même famille, dessin plus serré, plus éditorial. Conserve **Instrument Serif** (titres) et **JetBrains Mono** (eyebrows/mono uniquement).

Trois rôles fixes, aucun override inline :
- `font-serif` Instrument Serif → H1/H2 (28-32 / 20-22)
- `font-sans` Inter Tight → corps (14) et boutons texte
- `font-mono` JetBrains Mono → eyebrow uppercase 10px tracking 0.26em

Tailles plafonnées à 4 : 30 / 20 / 14 / 10. Plus aucune typo "spéciale" sur une page isolée.

## 2. Palette : nuances bordeaux + accents floraux (points 2, 11)

Garde la base solaire/corporate déjà posée, mais on ajoute la **gamme bordeaux à 4 nuances** + 2 nuances tirées de l'animation d'entrée (rose poudré, sauge très désaturée) en **filets/wash uniquement**, jamais en surface dominante :

- `--bordeaux` profond → CTA principal, surface "feature" unique par page
- `--bordeaux-soft` → liens, filets, boutons secondaires
- `--bordeaux-tint` clair → badges, états
- `--bordeaux-wash` crème teintée → fonds doux
- `--bloom-rose`, `--bloom-sage` → accents floraux discrets (puces, filets)
- `--solar`, `--sky` → accents fonctionnels (deadline, délégué)

Règle : **une seule surface "feature" bordeaux par écran**. Le reste = paper + filets.

## 3. Sigle "L" partout (point 13)

Déjà dans `ScreenHeader` (haut droite). J'ajoute aussi le sigle dans `Shell` pour les pages sans header (et reste discret sur `/start`).

## 4. Bottom nav (point 8)

Déjà retravaillée (marges `px-8`, icônes stroke 1.25, labels mono 8px). Je vérifie qu'elle reste à 4 items max par espace.

## 5. Pages à ramener au système (passe d'uniformisation)

Toutes ces pages doivent utiliser **uniquement** `Shell` + `ScreenHeader` + `Section` + `NavCard` + `NavLine`, surfaces `.surface`/`.surface-feature`, eyebrow mono, serif léger pour titres. Aucune typo/couleur custom dans la page.

| Page | Action |
|---|---|
| `/start` (point 2) | 1 phrase serif + 1 sous-phrase sans + 1 CTA bordeaux + 1 lien ghost. Stop. Sigle "L" en mono. Plus de 3 styles. |
| `/onboarding` étape 2 (points 3, 14) | Cards de choix : bordure dusk/15 → bordeaux 2px + fond `bordeaux-wash` à la sélection (état explicite). Textes 1 ligne. Retire "préparer mes volontés" du flux psy. |
| `/home` (point 9) | Audit conflit avec `/practical` — résolution du redirect. |
| `/plan` (points 4, 5, 7, 10) | Refonte : 4 colonnes d'état (À faire / En cours / Délégué / Fait) calculées par l'app. Plus de "qu'est-ce qui est urgent ?". Chaque tâche ouvre une fiche action (pourquoi, qui contacter, docs, modèle, déléguer). Inspiration Empathy/Inmemori. |
| `/practical/*` (points 5, 6, 7, 15) | Aides **concrètes uniquement** : PF, notaire, fleuriste, mairie, banque. Boutons d'Atmosphère réparés. `ceremony`, `atmosphere`, `flowers`, `booklet` ramenés au gabarit `NavCard`. |
| `/resources` (point 6) | Aides **psy uniquement** : thérapeutes, médecine douce, groupes. Séparation stricte. |
| `/accompany`, `/presence`, `/no-words`, `/journal` (points 15, 16) | Passe esthétique : Shell+Header standard, surface unique feature par page, halo floral discret sur `/accompany`. |
| `/memories` (point 15) | Cards `.surface`, eyebrow mono, typo unifiée. |
| `/circle` (point 12) | Délégation pure (déjà acté). Passe esthétique au gabarit. |

## Notes techniques

- Charge **Inter Tight** dans `__root.tsx` (`family=Inter+Tight:wght@300;400;500;600`), retire la déclaration "Inter" classique.
- `--font-sans` = `"Inter Tight", "Inter", ui-sans-serif`.
- Bordeaux nuances déjà présentes dans `styles.css` — je vérifie les valeurs et les utilise vraiment dans les composants au lieu d'`oklch` inline.
- Aucune logique métier modifiée hors `/plan` (où le brief le demande explicitement).

## Ordre d'exécution

1. Tokens (typo + palette nuancée) — `styles.css` + `__root.tsx`
2. `Shell.tsx` (sigle universel, vérif gabarit)
3. Passe `/start`, `/onboarding` (les deux portes d'entrée)
4. Refonte `/plan` (états + fiches)
5. Passe esthétique des pages psy + `memories` + `circle`
6. Passe esthétique pages concrètes + réparation boutons atmosphère
7. Audit `/home` ↔ `/practical`

Validez ce plan (ou ajustez l'ordre/le périmètre) et j'enchaîne tout d'une traite.