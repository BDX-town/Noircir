import { Post } from './Post';

export interface Tag {
    name: string,
    posts: Post[],
}