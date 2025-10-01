import type { FileStat } from "webdav";
import { client } from "./client";
import matter from 'gray-matter';
import type { Article } from "../types";
import { parse} from 'marked'

import turndown from 'turndown'
const turndownService = new turndown()

export async function getArticle(stat: FileStat): Promise<Article> {
    const raw = await client.getFileContents(stat.filename, { format: "text" }) as string;
    const { data, content } = matter(raw)
    return {
        createdAt: new Date(data.createdAt),
        cover: data.cover, 
        description: data.description,
        draft: data.draft,
        title: data.title,
        updatedAt: new Date(stat.lastmod),
        htmlContent: await parse(content)
    }
}

export async function findArticles() {
    const filedefs = (await client.getDirectoryContents("/") as FileStat[])
        .filter((f) => f.type === "file" && f.filename.endsWith('.md'))
    const files = await Promise.all(filedefs
        .map((f) => getArticle(f)
    ))
    return files
}