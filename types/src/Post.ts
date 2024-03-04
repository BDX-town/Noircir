export interface Post {
    file: string,
    title: string,
    description: string,
    weight: number,
    cover?: string,
    updatedAt: Date,
    createdAt: Date,
    content: string,
    draft: boolean,
}