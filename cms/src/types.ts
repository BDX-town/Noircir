export type Article = {
    title: string, 
    description: string,
    cover?: string,
    createdAt: Date,
    updatedAt: Date,
    draft: boolean,
    htmlContent: string,
}

export const DefaultArticle = {
    cover: "<cover-here>",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "<description-here>",
    draft: false,
    title: "<title-here>",
    htmlContent: "html-content-here"
} as const