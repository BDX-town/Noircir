import { client, CURRENT_BLOG } from './client';
import { Post } from './../types/Post';
import { WebdavFile } from './../types/webdav';

export async function getBlog() {
    const basePath = `/${CURRENT_BLOG.name}`;

    const rawMeta: string = await client.getFileContents(`${basePath}/meta.json`, { format: "text" });
    const meta = JSON.parse(rawMeta);

}