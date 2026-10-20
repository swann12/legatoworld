/** Articles d'aide (D011, x-article) : une seule page, plusieurs sujets. */
export type AideArticle = {
  id: string;
  title: [string, string];
  intro: string;
  steps: string[];
};

export const AIDE_ARTICLES: AideArticle[] = [
  {
    id: "inviter-un-proche",
    title: ["Comment inviter", "un proche ?"],
    intro: "En trois gestes —",
    steps: [
      "Ouvrez Mémoire, puis « Avec vos proches ».",
      "Touchez « Inviter quelqu'un » et choisissez ce qu'il pourra voir.",
      "Il reçoit un lien. Rien n'apparaît sans votre accord.",
    ],
  },
  {
    id: "supprimer-un-souvenir",
    title: ["Comment supprimer", "un souvenir ?"],
    intro: "En deux gestes —",
    steps: [
      "Ouvrez le souvenir dans Mémoire, puis touchez « Supprimer ».",
      "Confirmez : le souvenir est effacé pour vous et pour vos proches. Cette action est définitive.",
    ],
  },
  {
    id: "donnees-protegees",
    title: ["Mes données sont-elles", "protégées ?"],
    intro: "Trois repères —",
    steps: [
      "Tout ce que vous écrivez est privé par défaut : seuls vous et les personnes que vous invitez y ont accès.",
      "Vos documents sont rangés dans le coffre, avec un accès signé de courte durée.",
      "Vous pouvez tout télécharger ou tout supprimer depuis « Vos données », à tout moment.",
    ],
  },
];

export function findArticle(id: string): AideArticle | undefined {
  return AIDE_ARTICLES.find((a) => a.id === id);
}
