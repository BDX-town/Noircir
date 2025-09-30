export type Article = {
    title: string, 
    description: string,
    cover?: string,
    createdAt: Date,
    updatedAt: Date,
    draft: boolean,
}

export type HTMLArticle = Article & {
    htmlContent: string,
}


export type MDArticle = Article & {
    mdContent: string,
}