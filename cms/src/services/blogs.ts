import { CURRENT_BLOG } from './client';
import { Blog } from '../types/Blog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function editBlog(client: any, blog: Blog): Promise<boolean> {
    return client.putFileContents(`/${CURRENT_BLOG.name}/meta.json`, JSON.stringify(blog), { overwrite: true }) as Promise<boolean>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchBlog(client: any): Promise<Blog> {
    const basePath = `/${CURRENT_BLOG.name}`;
    const rawMeta: string = await client.getFileContents(`${basePath}/meta.json`, { format: "text" });
    const meta = JSON.parse(rawMeta) as Blog;
    return {
        description: meta.description,
        name: meta.name,
        picture: meta.picture
    }
}