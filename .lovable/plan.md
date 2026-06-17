## Plan — 3 vagues UX/produit, dans l'ordre

### Vague 1 — Cercle & collaboration (le plus gros chantier)

**Objectif** : transformer `/community` (page info statique) en vrai espace partagé : inviter des proches, déléguer des tâches, partager souvenirs/textes/listes.

**Backend (Lovable Cloud)**
- Tables : `circles` (id, owner_id, name, defunt_name), `circle_members` (circle_id, user_id, email, role: owner/proche/aidant, status: invited/active), `circle_invites` (token, circle_id, email, expires_at), `shared_items` (circle_id, kind: task/memory/text/wish/doc, payload jsonb, author_id, assignee_id?, status?).
- RLS : membres actifs voient/écrivent dans leur cercle. `has_circle_role(uid, circle_id, role)` SECURITY DEFINER pour éviter récursion.
- GRANT explicites sur chaque table (authenticated + service_role).
- Trigger `handle_new_user` déjà en place → ajouter création auto d'un cercle perso au signup.

**Server functions** (`src/lib/circle.functions.ts`)
- `createCircle`, `inviteToCircle` (génère token + envoie mail via Resend ou lien à copier), `acceptInvite`, `listMyCircles`, `listCircleMembers`, `shareItem`, `assignItem`, `updateItemStatus`.
- Toutes avec `requireSupabaseAuth`.

**Routes & UI**
- `/auth` (email + Google, défaut Lovable Cloud) — pré-requis.
- `_authenticated/circle.tsx` → liste des cercles, switcher.
- `_authenticated/circle.$id.tsx` → vue cercle : membres, fil partagé, tâches déléguées.
- `_authenticated/circle.$id.invite.tsx` → invitation (email + lien copiable).
- `/invite/$token` (public) → accepter, créer compte si besoin.
- Sur `/parcours.$taskId` : bouton **Déléguer** → choisir membre du cercle, statut passe à `délégué`.
- Sur `/memories`, `/wishes`, `/practical.texts` : bouton **Partager au cercle**.
- Refonte `/community` actuelle → `/community.groupes` (cercles thérapeutiques externes, contenu actuel conservé).

**Statuts de tâches manquants** (lié) : ajouter `en cours`, `délégué`, `bloqué`, `document manquant` dans `parcours.tsx` + détail tâche avec champ "qui s'en occupe".

---

### Vague 2 — IA émotionnelle reliée au reste

**Objectif** : les émotions captées (onboarding, journal, confide) influencent vraiment ce que l'app propose.

**État émotionnel persisté**
- Table `emotional_state` (user_id, mood, tags[], intensity, updated_at, source) — màj depuis onboarding, journal, ConfideDock, no-words.
- Server fn `getEmotionalContext` → renvoie état récent + tendance 7j.

**Personnalisation**
- `PersonalSuggestions` lit `emotional_context` et adapte le ton + les pistes (épuisé → micro-actions ; anxieux → ancrage ; perdu → repères).
- `suggestPractical` (ConfideDock) reçoit `emotional_context` en plus du `mode`.
- `home.tsx` : bandeau d'accueil dynamique ("Aujourd'hui, juste respirer" si épuisé récent ; "Une petite tâche, si vous voulez" si stable).
- **Auto-priorisation accueil** : server fn `getDailyFocus` combine (deadlines parcours, items manquants pratique, état émotionnel) → 1 action mise en avant.

**Verbes IA étendus** (compléter `practical-ai.functions.ts` ou créer fichiers dédiés)
- `composeHommage` (texte d'hommage personnalisé).
- `suggestFlowers` (déjà partiel → enrichir avec saison/région).
- `suggestRitual` (rituels multi-culturels : juif, musulman, bouddhiste, laïc, etc.).
- `suggestJournalPrompt` (relance d'écriture selon mood).
- Tous via Lovable AI Gateway (`google/gemini-2.5-flash` par défaut).

**Contenus structurés** (data files, pas IA)
- `src/lib/rituals-catalog.ts` : rituels par tradition.
- `src/lib/listening-lines.ts` : lignes d'écoute (SOS Amitié, etc.) au-delà de `/crisis`.
- `src/lib/gentle-medicine.ts` : médecines douces (sophrologie, méditation, respiration).
- Exposés dans `/inspiration` et `/help.index`.

---

### Vague 3 — Polish UX transverse

**États systématiques**
- Skeletons : `PersonalSuggestions`, `ConfideDock` (pendant l'appel IA), `practical-ai`, listes cercle/parcours. Composant réutilisable `<LegatoSkeleton variant="card|line|grid" />`.
- Empty states : `journal`, `memories`, `garden.$zone`, `appointments`, `parcours` → message d'accueil + 1 CTA doux (jamais une liste vide).
- Errors : composant `<GentleError onRetry={...} />` partout (au lieu de texte brut).
- Toasts (sonner) après actions : sauvegarde journal, partage cercle, délégation, ajout favori.

**Accessibilité**
- Audit `aria-label` sur tous les boutons icône (ConfideDock micro, ThemeToggle, fermetures sheet).
- Remplacer `text-dusk/45` et `/50` (contraste insuffisant) par `/65` minimum sur texte informatif.
- `:focus-visible` ring visible (currentColor 1px) sur tous les `ceramic`, `card-plain`, `btn-*`.
- `@media (prefers-reduced-motion)` : désactiver halos, ambiances animées, transitions > 200ms.
- Tailles tap mobile : passer les boutons 24px à min 44×44 (BottomNav, retours, micro-actions).

**Persistance & reprise**
- Auto-draft (debounce 500ms) → `journal`, `wishes`, `dates`, `practical.texts`, `practical.booklet`. Stocké local + sync cercle si connecté.
- "Reprendre où vous en étiez" sur `/home` : dernière route visitée + brouillon en cours.

**Cohérence micro**
- Composant unique `<BackLink to={...} label="Retour" />` partout (remplace les 3 variantes actuelles).
- Eyebrows : audit et normalisation (toujours `.eyebrow`, jamais inline `text-[10px] uppercase`).
- Icônes flèches : passer toutes à `→` Instrument Serif italic (cohérent avec design system).
- Breadcrumb léger sur `practical.*` sous-pages (Pratique › Fleurs).

**Parcours guidés**
- `compose.$zone` : overlay first-use (3 étapes : toucher, déplacer, valider) avec skip.
- `no-words` / `crisis` / `presence` : écran final "Comment vous sentez-vous maintenant ?" + retour accueil.
- Onboarding : bouton retour à chaque étape + sauvegarde locale de la progression.

---

### Ordre d'exécution & jalons

1. **Vague 1** (la plus lourde, débloque beaucoup) : auth → schéma → invitations → délégation → partage. Livrable visible : un proche peut recevoir un lien, créer un compte, voir une tâche déléguée.
2. **Vague 2** : table `emotional_state` → branchement PersonalSuggestions + ConfideDock + home → contenus structurés → verbes IA étendus.
3. **Vague 3** : composants partagés (Skeleton/Error/BackLink) d'abord, puis pass route-par-route a11y/empty/toast/reduced-motion.

À chaque fin de vague, build vert + un screenshot Playwright de la fonctionnalité phare.
