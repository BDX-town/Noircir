import { client } from './client';
import { Blog } from './../types/Blog';
import { Post } from './../types/Post';
import { WebdavFile } from './../types/webdav';
import yaml from 'yaml';

function parsePost(meta: WebdavFile, raw: string): Post{
    const etyMetaRaw = raw.match(/---\n(.|\n)+\n---/gm);
    if(!etyMetaRaw) throw new Error("File is not a valid 11ty .md file");
    const etyMeta = etyMetaRaw[0].replace(/---/g, '');
    // TODO: add supports for tags
    const partialPost: Pick<Post, "title" | "description"> & { cover: string  } = yaml.parse(etyMeta);

    return {
        file: meta.basename,
        weight: meta.size,
        updatedAt: new Date(meta.lastmod),
        cover: partialPost.cover,
        description: partialPost.description,
        title: partialPost.title,
    }
}

export async function getPosts(blog: Partial<Blog>): Promise<Post[]> {
    const files: WebdavFile[] = await client.getDirectoryContents(`/${blog.name}`);
    const postsMeta = files.filter((f) => f.basename.endsWith(".md"));
    const postsData = await Promise.all(
        postsMeta
            .map((f) => client.getFileContents(f.filename, { format: "text" }))
    );
    const posts = postsMeta.map((meta, index) => parsePost(meta, postsData[index]));
    return posts;
}