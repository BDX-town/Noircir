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

export const DefaultArticle = {
    id: '',
    cover: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "",
    draft: true,
    title: "",
    htmlContent: ""
} as const