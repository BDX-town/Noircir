import { Blog } from '../types/Blog';
import { WebdavClient } from '../types/webdav';

export function editBlog(client: WebdavClient, blog: Blog): Promise<boolean> {
    return client.putFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/meta.json`, JSON.stringify(blog), { overwrite: true }) as Promise<boolean>
}

export async function fetchBlog(client: WebdavClient): Promise<Blog> {
    const basePath = `/${import.meta.env.VITE_BLOGS_PATH}/${client.username}`;
    const rawMeta: string = await client.getFileContents(`${basePath}/meta.json`, { format: "text" });
    const meta = JSON.parse(rawMeta) as Blog;
    return {
        description: meta.description,
        name: meta.name,
        picture: meta.picture
    }
}