import { CURRENT_BLOG } from './client';
import { Blog } from '../types/Blog';
import { Post } from '../types/Post';
import { WebdavFile } from '../types/webdav';
import yaml from 'yaml';
import { formatPost } from '../helpers/formatPost';


export function deserializePost(p: Post): Post {
    return {
        ...p,
        updatedAt: new Date(p.updatedAt),
    }
}

function parsePost(meta: WebdavFile, raw: string): Post{
    const etyMetaRaw = raw.match(/---\n(.|\n)+\n---/gm);
    if(!etyMetaRaw) throw new Error("File is not a valid 11ty .md file");
    const etyMeta = etyMetaRaw[0].replace(/---/g, '');
    // TODO: add supports for tags
    const partialPost: Pick<Post, "title" | "description"> & { cover: string  } = yaml.parse(etyMeta);
    const content = raw.replace(etyMetaRaw[0], '');

    return {
        file: meta.basename,
        weight: meta.size,
        updatedAt: new Date(meta.lastmod),
        cover: partialPost.cover,
        description: partialPost.description,
        title: partialPost.title,
        content
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function editPost(client: any, blog: Blog, post: Post) {
    const content = formatPost(post);
    return client.putFileContents(`/${CURRENT_BLOG.name}/${post.file}`, content, { overwrite: true }) as boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deletePost(client: any, blog: Blog, post: Post) {
    return client.deleteFile(`/${CURRENT_BLOG.name}/${post.file}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchPosts(client: any, blog: Partial<Blog>): Promise<Post[]> {
    const files: WebdavFile[] = await client.getDirectoryContents(`/${blog.name}`);
    const postsMeta = files.filter((f) => f.basename.endsWith(".md"));
    const postsData = await Promise.all(
        postsMeta
            .map((f) => client.getFileContents(f.filename, { format: "text" }))
    );
    const posts = postsMeta.map((meta, index) => {
        try {
            return parsePost(meta, postsData[index])
        } catch (e) {
            console.error(e);
            return null;
        }
    }).filter((f) => !!f) as Post[];
    return posts;
}