import { Media } from "./Media";

export interface Post {
    file: string,
    title: string,
    description: string,
    weight: number,
    cover: Media,
    updatedAt: Date,
}