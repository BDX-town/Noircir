export type Article = {
    url: string;
    title: string;
    description: string;
    updatedAt: Date;
    createdAt: Date;
    tags: string[];
    coverUrl: string;
}

export type Blog = {
    title: string,
    description: string,
    coverUrl: string,
}