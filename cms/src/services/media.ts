import { Media } from 'types/src/Media';
import { WebdavFile } from '../types/webdav';
import { buildUrl } from '../helpers/buildUrl';
import { AppError, declareError } from '../data/AppError';
import { Webdav } from './webdav';

export function deserializeMedia(m: Media): Media {
    return {
        ...m,
        updatedAt: new Date(m.updatedAt)
    }
}


export const PARSE_MEDIA_FAIL = declareError('Unable to retrieve your media. There is maybe something wrong on our end but please check your connection.');
export const PARSE_MEDIA_DENY = declareError('You do not have access to this media. Please check your credentials.');
export const PARSE_MEDIA_NOTFOUND = declareError('The requested media does not exist (anymore ?).')
export const PARSE_MEDIA_FORMAT = declareError('The requested media is malformed. Please try to reupload it.');
async function parseMedia(client: Webdav, file: WebdavFile): Promise<Media> {
    const response = await client.getFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources/${file.basename}`);

    if(!response.ok) {
        let code = PARSE_MEDIA_FAIL;
        if(response.status === 401 || response.status === 403) code = PARSE_MEDIA_DENY;
        else if(response.status === 404) code = PARSE_MEDIA_NOTFOUND;
        throw new AppError(code, `${response.status}: ${response.statusText}`)
    }
    const content = await response.arrayBuffer();
    try {
        return {
            file: file.basename,
            updatedAt: new Date(file.lastmod),
            weight: file.size,
            url: buildUrl(file.filename),
            content,
        }
    } catch (e) {
        throw new AppError(PARSE_MEDIA_FORMAT, (e as object).toString());
    }
}


export const PUT_MEDIA_FAIL = declareError('Unable to save your media. There is maybe something wrong on our end, but please check your connection.');
export const PUT_MEDIA_DENY = declareError('You do not have access to this media. Please check your credentials.');
export const PUT_MEDIA_FALSE = declareError('Your media was not saved. Please report this issue to your administrator.');
export const PUT_MEDIA_QUEUED = declareError('Since you are offline, your media will be sent to server when you will be back online.');
export async function putMedia(client: Webdav, media: Media) {
    const response = await client.putFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources/${media.file}`, media.content, { overwrite: true });
    if(!response.ok) {
        let code = PUT_MEDIA_FAIL;
        if(response.status === 401 || response.status === 403) {
            code = PUT_MEDIA_DENY;
        }
        if(response.status === 412) {
            code = PUT_MEDIA_FALSE;
        }
        throw new AppError(code, `${response.status}: ${response.statusText}`)
    }
    if(response.status === 202) throw new AppError(PUT_MEDIA_QUEUED, "offline");
}

export const DELETE_MEDIA_FAIL = declareError('Unable to delete your media. There is maybe something wrong on our end but please check your connection.');
export const DELETE_MEDIA_DENY = declareError('You do not have access to this media. Please check your credentials.');
export async function deleteMedia(client: Webdav, media: Media) {
    const response = await client.deleteFile(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources/${media.file}`);
    if(!response.ok && response.status !== 404) {
        let code = DELETE_MEDIA_FAIL;
        if(response.status === 401 || response.status === 403) code = DELETE_MEDIA_DENY;
        throw new AppError(code, `${response.status}: ${response.statusText}`)
    }
} 

export const FETCH_MEDIA_FAIL = declareError('Unable to retrieve your media directory. There is maybe something wrong on our end but please check your connection.');
export const FETCH_MEDIA_DENY = declareError('You do not have access to these media. Please check your credentials.');
export const FETCH_MEDIA_NOTFOUND = declareError('The requested media directory does not exist (anymore ?). Please notice this issue to your administrator.')
export async function fetchMedia(client: Webdav): Promise<Media[]> {
    const response = await client.getDirectoryContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources`);

    if(!response.ok) {
        let code = FETCH_MEDIA_FAIL;
        if(response.status === 401 || response.status === 403) code = FETCH_MEDIA_DENY;
        else if(response.status === 404) code = FETCH_MEDIA_NOTFOUND;
        throw new AppError(code, `${response.status}: ${response.statusText}`)
    }
    let files: WebdavFile[] = [];
    try {
        files = await response.json();
    } catch (e) {
        // json badly dormated
        const error = e as Error;
        throw new AppError(FETCH_MEDIA_FAIL, error.message || (e as object).toString())
    }
    // dont know why folder is sometimes shown as file
    return Promise.all(files.map((f) => parseMedia(client, f)));
}