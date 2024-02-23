export interface IArticle {
    title: string, 
    cover: string,
    description: string,
    content: any,
    blogName: string,
    blogDescription: string,
    blogCover: string,
    lang: string,
    updatedAt: string,
    createdAt: string,
    style: string,
    page: {
        url: string,
    }
}