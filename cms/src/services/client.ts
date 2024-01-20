import { Blog } from "../types/Blog";

export const CURRENT_BLOG: Pick<Blog, "name"> = {
    name: import.meta.env.VITE_DEFAULT_BLOG,
}
