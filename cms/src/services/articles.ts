import type { FileStat } from "webdav";
import { client, getBlogContent, NOT_AUTHENTICATED_ERROR } from "./client";
import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { Article } from "../types";
import { parse} from 'marked'

import turndown from 'turndown'
import { AppError } from "../utils/error";
const turndownService = new turndown()

// Configurer js-yaml pour éviter les littéraux pliés
const yamlOptions = {
  lineWidth: Infinity, // Empêche les sauts de ligne automatiques
  flowLevel: -1, // Désactive le style de bloc
};

export async function getArticle(stat: FileStat): Promise<Article> {
    if(!client) throw new AppError(NOT_AUTHENTICATED_ERROR)
    const raw = await client.getFileContents(stat.filename, { format: "text" }) as string;
console.log(raw)
    const { data, content } = matter(raw)
    return {
        id: stat.basename,
        createdAt: new Date(data.createdAt),
        cover: data.cover, 
        description: data.description,
        draft: data.draft,
        title: data.title,
        updatedAt: new Date(stat.lastmod),
        htmlContent: await parse(content)
    }
}


const mutations = {
    'id': () => ({}),
    'htmlContent': (c: string) => ({ 'mdContent': turndownService.turndown(c)}),
    'createdAt': (d: Date) => ({ 'createdAt': d.toISOString() }),
    'updatedAt': (d: Date) => ({ 'updatedAt': d.toISOString() }),
} as Record<string, (d: any) => Record<string, string>>
export async function saveArticle(article: Article): Promise<Article | null> {
    if(!client) throw new AppError(NOT_AUTHENTICATED_ERROR)
    // TODO: validate input
    let newlyCreated = !article.id
    if(!article.id) {
        // we are creating a new file 
        const id = `${article.title.replace(/[^\w\s]/gi, '-').replace(/ /g, '-')}-${new Date().getTime()}`
        article.id = encodeURIComponent(`${id}.md`)
    }

    if(!article.id.endsWith('.md')) throw new Error('Illegal file id');

    const parsed = Object.keys(article).reduce((acc: any, cur) => {
        const curr = cur as keyof Article;
        if(mutations[curr]) {
            return {
                ...acc,
                ...(mutations[curr](article[curr]))
            }
        } else {
            return {
                ...acc, 
                [curr]: article[curr]
            }
        }
    }, {})

    const { mdContent } = parsed;
    delete parsed.mdContent;

    console.log('matter', `*${parsed.cover}*`)

    const content = matter.stringify(mdContent, parsed, { language: 'yaml', lineWidth: -1 });

    console.log('content', content)
    // we dont want to erase an existing file while creating a new one
    // the / at beginning is mandatory to avoid errors
    const result = await client.putFileContents(`/${article.id}`, content, { overwrite: !newlyCreated })
    if(result) {
        return article
    } 
    throw new Error('Unable to save article')
}

export async function deleteArticle(article: Article) {
    if(!client) throw new AppError(NOT_AUTHENTICATED_ERROR)
    // TODO: check inputs
    // the / at beginning is mandatory to avoid errors
    return client.deleteFile(`/${article.id}`)
}

export async function fetchArticles() {
    const filedefs = (await getBlogContent())
        .filter((f) => f.type === "file" && f.filename.endsWith('.md') && f.basename !== "index.md")
    // TODO: can be cached here to avoid retrieveing unmodified articles 
    const files = await Promise.all(filedefs
        .map((f) => getArticle(f)
    ))
    return files
}