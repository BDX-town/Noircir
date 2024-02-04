import { Media } from '../types/Media';
import { WebdavFile } from '../types/webdav';
import { Blog } from '../types/Blog';
import { CURRENT_BLOG } from './client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseMedia(client: any, file: WebdavFile): Promise<Media> {
    return {
        file: file.basename,
        updatedAt: new Date(file.lastmod),
        weight: file.size,
        url: `${import.meta.env.VITE_SERVER}/${file.filename}`,
        content: await client.getFileContents(`/${CURRENT_BLOG.name}/ressources/${file.basename}`),
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function putMedia(client: any, media: Media) {
    const request = await client.putFileContents(`/${CURRENT_BLOG.name}/ressources/${media.file}`, media.content, { overwrite: true, contentLength: media.weight });
    if(request) {
        return {
            ...media,
            url: `${import.meta.env.VITE_SERVER}/${CURRENT_BLOG.name}/ressources/${media.file}`,
        }
    }
    throw new Error('Unable to upload');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deleteMedia(client: any, media: Media) {
    return client.deleteFile(`/${CURRENT_BLOG.name}/ressources/${media.file}`);
} 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchMedia(client: any, blog: Partial<Blog>): Promise<Media[]> {
    const files: WebdavFile[] = await client.getDirectoryContents(`/${blog.name}/ressources`);
    return await Promise.all(files.map((f) => parseMedia(client, f)))
}