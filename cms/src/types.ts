export type Article = {
    id: string,
    title: string,
    description: string,
    cover?: string,
    createdAt: Date,
    updatedAt: Date,
    draft: boolean,
    htmlContent: string,
}

export type Blog = {
    description: string,
    name: string,
    cover: string,
    layout?: "article.11ty.js", // May be changed in the future
    lang: "fr-FR",
    fediverse?: string
}

export const DefaultArticle: Article = {
    id: '',
    cover: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "",
    draft: true,
    title: "",
    htmlContent: ""
} as const


export const DefautBlog: Blog = {
 cover: '',
 description: '',
 lang: "fr-FR",
 name: '',
}