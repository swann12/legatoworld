# Legato — audit UX/UI et refonte des parcours

Votre demande couvre 43 points. Je la découpe en 5 lots livrables l'un après l'autre, du plus bloquant au plus profond. Aucun choix de couleurs important ne sera pris avant que vous m'envoyiez la palette officielle : je travaille uniquement avec les teintes déjà en place d'ici là.

## Lot 1 — Réparer (bloquant)

- **Jardin** : rendre l'accès et le dépôt de souvenirs réellement fonctionnels. Chaque catégorie (Photo, Lettre, Voix, Musique, Objet, Citation) ouvre sa propre parcelle, avec la liste des souvenirs existants, un dépôt direct du bon type et un retour évident au Jardin.
- **Logo** : ne renvoie plus vers « Space », mais vers l'accueil de l'univers en cours.
- **Page Space** : supprimée comme destination ; ses éléments utiles rejoignent Soutien, Démarches et Profil.
- **Retour** : un même bouton retour, toujours au même endroit, sur toutes les pages secondaires.
- **Audit des boutons** : passage sur chaque lien/carte/CTA ; toute destination qui ne correspond pas au libellé est corrigée, les boucles et pages génériques intermédiaires sont supprimées.
- **Fluidité** : Start allégé (transitions, délais), citation d'ouverture affichée ~3 s puis enchaînement automatique, avec passage immédiat au toucher.

## Lot 2 — Onboarding

- Suppression de tous les prénoms fictifs ; placeholders neutres uniquement ; la proposition par défaut devient « Mon ami » et non « Mon ami Léa ».
- Barre de progression recalculée sur le nombre réel d'étapes (questions émotionnelles incluses), plus fine et plus discrète.
- « Les deux mais séparément » → « Les deux ».
- Chaque question passe en logique sélection plutôt que champ libre ; le texte libre reste possible via « Autre ».

## Lot 3 — Architecture de navigation

- Suppression des barres d'outils hautes.
- Switch bas persistant **Soutien · Démarches**, discret, visible au scroll, avec à côté une entrée secondaire **Alléger**.
- Mode « Alléger » : moins de cartes, une action à la fois, textes raccourcis, plus d'air — une vraie réduction de charge, pas seulement visuelle.
- Chaque univers n'affiche que ses contenus ; les outils apparaissent dans la page selon leur pertinence, plus dans une barre permanente.
- Démarches conserve Immédiat / Cette semaine / Ce mois-ci / Plus tard ; « Voir les éléments archivés » redescend en secondaire.

## Lot 4 — Pages à refaire

- **Présence** : titre, une phrase, « Comment c'est aujourd'hui ? », puis directement la conversation avec quelques amorces. Les explications sur l'IA passent en second niveau.
- **Corps** : parcours en 3 étapes (énergie, sommeil, alimentation), uniquement des états à sélectionner, puis 1 à 3 pistes réellement adaptées.
- **Ressources** : refonte éditoriale, rattachée à Soutien (À lire, À écouter, À regarder, Pour comprendre, Pour aujourd'hui) ou à Démarches (succession, banque, assurance, employeur, logement, organismes, cérémonie, documents). Fin du switch « Soi / Démarches ».
- **Professionnels** : vraie page par catégories (psychologue, association, service funéraire, notaire, avocat, assistant social).

## Lot 5 — Personnalisation et IA

- **Portrait de la personne** : construction par sélections successives (ce qui lui ressemblait, comment elle était), champ libre facultatif en fin de parcours. Ce portrait alimente Présence, rituels, cérémonie, Jardin, recommandations.
- **Cérémonie** : accompagnement IA renforcé par le choix — fleurs (couleurs → univers → esprit → propositions), musique (énergie, époque, style), textes (sensibilité, type, longueur). Toujours une conversation guidée par sélection, jamais un formulaire.
- **Mes espaces** : plusieurs espaces (mère, ami, autre perte), créés/modifiés/supprimés depuis le Profil avec confirmation à la suppression, chacun avec ses réponses, son portrait, son Jardin, ses démarches, ses dates.
- **Dates importantes** : plusieurs par espace, vue globale dans le Profil, proposition discrète de rituel quand une date approche.
- **Profil** restructuré : Mes espaces, Dates importantes, Rituels, Préférences, Archives, Compte.

## Transversal (appliqué au fil des lots)

- Wording français revu partout : simple, sensible, jamais vague ; CTA explicites.
- Hiérarchie par écran : une chose à comprendre, une action principale, le reste en second.
- Pictogrammes réduits et harmonisés.
- Typographie et interlignage vérifiés, en particulier sur Ressources.
- Cohérence : mêmes règles de titres, cartes, espacements, états actifs.

## Détails techniques

- Nouveau composant de switch bas (Soutien/Démarches + Alléger) remplaçant la barre de navigation à 5 entrées et les sous-navigations hautes.
- Préférence « mode allégé » et espace actif stockés dans l'état global existant (`src/lib/legato-state.tsx`), avec migration des données actuelles vers un espace par défaut.
- Composant réutilisable de sélection multiple (chips) pour portrait, corps, cérémonie, rituels.
- Route `/space` supprimée, redirections corrigées ; audit systématique des `Link`/`navigate` pour vérifier libellé = destination.
- Aucune modification des tokens de couleur avant réception de la palette.

Dites-moi si l'ordre des lots vous convient, et j'attaque le lot 1.
