import * as webdav from "webdav/web";
import { Blog } from "../types/Blog";

export const CURRENT_BLOG: Pick<Blog, "name"> = {
    name: import.meta.env.DEFAULT_BLOG,
}

// TODO: add auth
export const client = webdav.createClient(import.meta.env.SERVER);