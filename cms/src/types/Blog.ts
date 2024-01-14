import { Post } from './Post';
import { Media } from './Media';

export interface Blog {
    name: string,
    description: string,
    posts: Post[],
    media: Media[],
}