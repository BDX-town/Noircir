import type { FileStat } from "webdav";
import { client, getBlogContent, NOT_AUTHENTICATED_ERROR } from "./client";
import type { Blog } from "../types";
import { AppError } from "../utils/error";


export async function getBlog(stat: FileStat): Promise<Blog> {
    if(!client) throw new AppError(NOT_AUTHENTICATED_ERROR)
    const raw = await client.getFileContents(stat.filename, { format: "text" }) as string;
    const json = JSON.parse(raw)
    return {
        cover: json.blogCover,
        description: json.blogDescription,
        lang: json.lang,
        layout: json.layout,
        name: json.blogName,
        fediverse: json.fediverse
    }
}

const mutations = {
    'cover': (v) => ({ blogCover: v }),
    'name': (v) => ({ blogName: v }),
    'description': (v) => ({ blogDescription: v }),
} as Record<string, (d: any) => Record<string, string>>
export async function saveBlog(blog: Blog) {
    if(!client) throw new AppError(NOT_AUTHENTICATED_ERROR)
    // TODO: check input

    const parsed = Object.keys(blog).reduce((acc: any, cur) => {
        const curr = cur as keyof Blog;
        if(mutations[curr]) {
            return {
                ...acc,
                ...(mutations[curr](blog[curr]))
            }
        } else {
            return {
                ...acc, 
                [curr]: blog[curr]
            }
        }
    }, {})

    const result = await client.putFileContents(`/${import.meta.env.VITE_USERNAME}.json`, JSON.stringify(parsed))
    if(!result) throw new Error('Unable to save blog')
    return blog
}

export async function fetchBlog(): Promise<Blog | undefined> {
    const blogstat = (await getBlogContent())
        .find((f) => f.type === "file" && f.filename.endsWith('.json'))
    if(!blogstat) return undefined;
    return getBlog(blogstat)
}