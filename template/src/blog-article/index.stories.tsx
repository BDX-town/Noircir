import type { Meta, StoryObj } from "@storybook/web-components";
import './index.js'
import { html } from "lit";

const meta: Meta = {
  component: "blog-article",
};

export default meta;
type Story = StoryObj;

// @ts-expect-error dont care
function Render({ blog, article }) {
  return html`
  <blog-article .blog=${blog} .article=${article}>
                        <h1>Préambule</h1>
<p>Nous ne sommes pas le jeudi 22 mai 2025. Nous sommes le lundi 06 octobre 2025 et il est 2h20 du matin.&nbsp; &nbsp;&nbsp;<br>
N'arrivant pas à trouver le sommeil, comme c'est régulièrement le cas les dimanches soirs ces derniers temps, je décide de cesser de me torturer l'esprit vainement et de faire quelque chose d'utile - et de relaxant.&nbsp; &nbsp;&nbsp;<br>
La lumière de la pleine lune filtre par le store de ma chambre, et dans l'objectif de prouver à ma mère que non, celle-ci n'empêche pas de dormir, j'espère bien trouver le sommeil à la fin de cette rédaction.</p>
<h1>Est-ce qu'on devrait tous pratiquer une activité artistique ?</h1>
<p>Cette question est intéressante.&nbsp; &nbsp;<br>
Je vais donc vous proposer d'y répondre&nbsp;brièvement&nbsp;avant de parler de ce dont j'ai envie de parler. C'est bien mieux comme ça.&nbsp; &nbsp;<br>
&nbsp;&nbsp;<br>
Non. Tout le monde ne devrait pas pratiquer une activité artistique.&nbsp; &nbsp;<br>
&nbsp;&nbsp;<br>
Déjà parce que la notion de devoir s'oppose à l'idée même de l'art en tant que tel. Le devoir, c'est la contrainte. Et bien qu'il ne soit pas impossible de produire de l'art sous la contrainte, celui-ci est bien plus intéressant lorsqu'il est libre. Si je <em>dois</em> produire, je quitte le domaine artistique pour rentrer dans celui de l'artisanat et, bien que cela ne retire rien à la qualité de l'objet, il ne s'agit plus de la même chose.</p>
<blockquote>
<p>A noter que je parle ici d'un devoir exogène. Si ce sens de devoir exprimer, de devoir produire quelque chose provient de l'individu lui-même, difficile de considérer qu'il s'agit ici d'une dénaturation. Considérons plutôt qu'il s'agit d'une pulsion créatrice.</p>
</blockquote>
<p>Ensuite, parce que tout le monde n'est pas doué de talent. S'il s'agissait d'inonder le monde de production artistique à courte vue, produite par monsieur tout-le-monde, par obligation, alors il n'aurait pas été nécessaire d'attendre l'avènement des modèles génératifs pour submerger le paysage culturel de contenu inintéressant et vide d'intérêt en soi.</p>
<p>En revanche, il est d'une importance capitale que les individus, pour s'éviter de tomber dans une morne apathie au sortir de leur activité professionnelle ou pire, de dépendre intégralement des autres pour réaliser la moindre tâche, aient une activité de création. Une activité <em>humanisante</em>.</p>
<p>L'ensemble de nos interactions avec le monde semblent nécessiter de moins en moins d'investissement de notre part. En parallèle, le développement d'une économie entière basée sur l'extirpation de la moindre once d'attention pousse l'humain à traverser son existence comme un fantôme. A ne pas considérer, ne pas s'investir dans sa propre existence. Or, pour cela, la confrontation au monde réel est d'une importance capitale.</p>
<p>L’activité de création dont je parle ici peut prendre de nombreuses formes: écriture, mécanique, musique, dessin, et même - pour les plus tristes d'entre nous - développement informatique.</p>
<blockquote>
<p>Le lecteur averti aura relevé que dans les exemples ci-dessus se sont glissées deux activités artistiques. Le lecteur réfléchi aura déjà compris qu'il s'agit ici d'un manifeste pour la création, artistique ou non.</p>
</blockquote>
<p>Si je suis si ouvert quant à l'activité de création pratiquée c'est parce que mon propos reste valide tant qu'un seul élément est respecté: la confrontation à un environnement antagoniste.&nbsp;<br>
Cet environnement peut être le moteur de votre Peugeot 103 dont le&nbsp;vilebrequin&nbsp;semble avoir du jeu ce qui provoque des vibrations désagréables à partir de 45km/h (70 compteur), le tambour de votre machine à laver ou le manche sans cases de votre violon**<em>celle</em>**.<br>
En s'opposant à nous, le monde (ou plutôt la partie du monde que nous souhaitons affronter) requiert de nous une attention toute particulière, qui ne tolère qu'assez peu les erreurs qu'elles soient d'inattention ou non.&nbsp;<br>
Ainsi ce type de rapport au monde <em>implique de s'impliquer</em>&nbsp;et récompense par le but atteint.&nbsp;<br>
Dans le même temps, l'erreur ayant un coût elle va faire apparaître chez l'intervenant une propension à la planification d'autant plus gratifiante lorsque le plan se passe sans accroc, que celui se matérialise à travers une tablature ou un code source qui compile sans erreur. La planification rend sensation de contrôle, d'existence et de puissance sur le réel. Je peux modifier le monde et je peux imaginer comment je vais le modifier en amont.</p>
<p>Il n'y a de plaisir que dans l'activité consciente, précisément quand notre mode de production professionnel et la société de consommation cherche à nous alléger la tâche et par là même nous retirer plaisir de vivre.<br>
En parlant d'activité professionnelle il serait d'ailleurs possible de me demander pourquoi je recommande ici d'avoir une activité de création en dehors de celles-ci alors qu'il est parfaitement possible d'avoir un métier lui-même créatif. Encore une fois, il s'agit ici d'un rapport à la contrainte d'une part, mais d'autre part et surtout, de choix. En travaillant, on produit toujours pour un autre qu'on soit patron ou pas. C'est la valeur de ce que l'on produit qui permettra, une fois transformée en argent, d'avoir accès à d'autres biens ou services. Mais ce processus rend dépendant. Du patron, du chef, du client, de l'Etat. Il s'agit ici de retrouver une forme d'affirmation de la puissance et d'individualité dans/sur le monde en choisissant ses armes et son combat. D'affronter une partie de la réalité que notre emploi ne nous permet pas d'affronter.</p>
<p>Cela dit, je vais profiter d'une autre insomnie* pour conclure: "Non, tout le monde ne devrait pas pratiquer une activité artistique."&nbsp;<br>
En revanche, nous gagnerons tous à profiter de notre temps ici pour créer et si possible sans rechercher de gain, excepté celui d'avoir effectué la tâche en question. Remplacer le goût du travail bien fait par le goût de faire, qu'il s'agisse d'art ou de choses moins "nobles".<br>
Toutefois, rendre la pratique obligatoire comme le sous-tend le titre, que ce soit via la norme ou des moyens plus explicites, vide cette idée de sa substance.&nbsp;<br>
Ainsi pour ma part, je me contente de valoriser la moindre activité réalisée par mes amis, tout en les rassurant sur leur droit à ne pas être productifs.</p>
<p>* Du mardi 4 novembre à 3h28 celle-la</p>
                    </blog-article>
  `
}

export const Exemple: Story = {
  // @ts-expect-error dont care
  render: Render,
    args: {
      article: {
        title: "Erreurs et regrets",
        description: "Pour une fois je vais essayer de faire un test court",
        updatedAt: new Date(),
        tags: ["test"],
        coverUrl: "https://img.freepik.com/premium-photo/cute-3d-clay-stylized-rendered-professional-holding-business-card-light-green-orange_967785-58968.jpg",
        url: "https://exemple.com/article/erreurs-et-regrets"
      },
      blog: {
        title: "Mon Blog",
        coverUrl: "https://img.freepik.com/premium-photo/cute-3d-clay-stylized-rendered-professional-holding-business-card-light-green-orange_967785-58968.jpg",
        description: "Un blog d'exemple pour Storybook."
      }
    }
};
