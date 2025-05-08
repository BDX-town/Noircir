import type { Story } from "@ladle/react"
import React from "react"
import Article from "./parts/Article.tsx"

export const ArticleStory: Story = (props) => <Article {...props}></Article>
ArticleStory.storyName = "Article"

ArticleStory.args = {
    title: 'Découvertes n°1 - Les robots rêvent-ils de guitares éléctriques ?',
    fediverse: undefined,
    blogName: 'Boxon',
    blogCover: 'https://noircir.bdx.town//blogs/clovis/ressources/T5FUKQQQJ-UJF1UUP2R-6d3621e91c4f-512.jpg.webp',
    lang: 'fr-FR',
    content: '<p>#blues #variété #glam #français #rock</p>\n' +
        '<p>La playlist: </p>\n' +
        '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/4U3eUlvHy9QQNsmCokmyD5?utm_source=generator" width="100%" height="380" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" /></iframe>\n' +
        '<h1>The Grassland Sinners</h1>\n' +
        '<p><img height="300px" src="https://noircir.bdx.town//blogs/clovis/ressources/T5FUKQQQJ-UJF1UUP2R-6d3621e91c4f-512.jpg.webp" /></p>\n' +
        "<p>Se présente comme un groupe de Rock'n'soul'n'blues'n'groove'n'indie basé à Barcelone.</p>\n" +
        '<iframe width="100%" height="42px" border="0" src="https://bandcamp.com/EmbeddedPlayer/album=957922904/size=small/bgcol=ffffff/linkcol=0687f5/track=3281699042/transparent=true/" seamless="" /></iframe>\n' +
        '<p>Lien vers leur site: <a href="http://www.grasslandsinners.com/">http://www.grasslandsinners.com/</a></p>\n' +
        '<h1>Ottis cœur</h1>\n' +
        '<p><img src="https://noircir.bdx.town//blogs/clovis/ressources/T5FUKQQQJ-UJF1UUP2R-6d3621e91c4f-512.jpg.webp" height="300px"  /></p>\n' +
        '<p>Groupe de Garage Rock parisien et exclusivement féminin. *Labrador* donne la pêche.</p>\n' +
        '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/37RU5uDagBkmkcf61HGHTZ?utm_source=generator" width="100%" height="80" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /></iframe>\n' +
        '<p>Lien vers leur instagram: <a href="https://www.instagram.com/ottiscoeur/">https://www.instagram.com/ottiscoeur/</a></p>\n' +
        '<h1>The Moon City Masters</h1>\n' +
        '<p><img src="https://plume.bdx.town/static/media/BF1E175C-23F6-9C18-174A-2ED4E8D292B7.jpeg" height="300px" /></p>\n' +
        "<p>Deux jumeaux identiques avec une esthétique très Glam et très rétro. D'aucuns diraient que c'est pas très original, mais ça donne quand même bien. </p>\n" +
        '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0hV6HHEtcDVUxiZPuI050H?utm_source=generator" width="100%" height="80" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /></iframe>\n' +
        '<p>Lien vers leur site: <a href="https://www.mooncitymasters.com/">https://www.mooncitymasters.com/</a></p>\n' +
        '<h1>Syd Carter West </h1>\n' +
        '<p><img src="https://plume.bdx.town/static/media/2F4C7B96-1F4B-984E-7E9A-075AF1CCD4E5.jpeg" height="300px" /></p>\n' +
        "<p>Une artiste à la voix grave et puissante, donnant dans le Blues Rock. Formation classique à l'opéra et ça se sent.  </p>\n" +
        '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2iM4gTTqejzsn48vo6YUqM?utm_source=generator" width="100%" height="80" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /></iframe>\n' +
        '<p>Lien vers son site: <a href="https://sydcarterwest.com/">https://sydcarterwest.com/</a></p>\n' +
        '<h1>Larkin Poe</h1>\n' +
        '<p><img src="https://plume.bdx.town/static/media/027CF5CC-4586-A1B8-5C21-73BE656E0908.jpg" height="300px" /></p>\n' +
        "<p>Deux descendantes d'Edgar Allan Poe (si si, c'est sur leur site) produisant du rock fortement teinté du sud des Etats-Unis. </p>\n" +
        '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2se33uCsb88PVwbp6ESNGb?utm_source=generator" width="100%" height="80" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /></iframe>\n' +
        '<p>Lien vers leur site: <a href="https://www.larkinpoe.com/">https://www.larkinpoe.com/</a></p>\n' +
        '<h1>Bolivard </h1>\n' +
        '<p><img src="https://plume.bdx.town/static/media/824A76DD-C012-CFF2-6007-65827FBC51E8.jpg" height="300px" /></p>\n' +
        "<p>L'autre français d'la sélection, c'est le seul à ne pas produire une variante de rock. Certainement le plus intéressant dans sa démarche également, visiblement axée autour de plusieurs personnages. </p>\n" +
        '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4bBkv3LYIwWRqAJ8rS1DdI?utm_source=generator" width="100%" height="80" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /></iframe>\n' +
        '<p>Lien vers son Linktree: <a href="https://linktr.ee/bolivard">https://linktr.ee/bolivard</a></p>\n' +
        "<p><em>De l'usage important de Spotify/Instagram dans cet article: Dès que possible j'essaie d'utiliser d'autres plateformes pour permettre l'écoute de l'artiste ou la consultation de ses créations. Néanmoins nombre d'entre eux ne sont pas forcément dans une démarche d'émancipation informatique, et ne sont présents que sur ces plateformes.</em> posts.ts:54:12</p>\n",
    style: '/style.css',
    page: {
        date: new Date('2025-01-18T09:18:00.767Z'),
        inputPath: './blogs/test/a-test.md',
        fileSlug: 'a-test',
        filePathStem: '/test/a-test',
        outputFileExtension: 'html',
        templateSyntax: '11ty.js,md',
        url: '/test/a-test/',
        outputPath: '_site/test/a-test/index.html'
    },
    cover: 'https://noircir.bdx.town/blogs/clovis/ressources/1000007217.png.webp',
    description: 'Les robots rêvent-ils de guitares éléctriques ?'
}
ArticleStory.argTypes = {}
