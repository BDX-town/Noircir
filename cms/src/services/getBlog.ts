import { client, CURRENT_BLOG } from './client';
import { Blog } from './../types/Blog';

export async function getBlog(): Promise<Blog> {
    const basePath = `/${CURRENT_BLOG.name}`;

    const rawMeta: string = await client.getFileContents(`${basePath}/meta.json`, { format: "text" });
    const meta = JSON.parse(rawMeta) as Blog;
    return {
        description: meta.description,
        name: meta.name,
    }
}