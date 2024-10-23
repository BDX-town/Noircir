import { Post } from 'types/src/Post';
import { WebdavFile } from '../types/webdav';
import yaml from 'yaml';
import { formatPost } from '../helpers/formatPost';
import { AppError, declareError } from '../data/AppError';
import { Webdav } from './webdav';

export function buildLink(server: string, client: Webdav, post: Post) {
    return new URL(`${client.username}/${post.file.replace(/\..+$/, '')}/index.html`, server).toString()
}

export function deserializePost(p: Post): Post {
    return {
        ...p,
        updatedAt: new Date(p.updatedAt),
        createdAt: new Date(p.createdAt),
    }
}

export const PARSE_POST_FORMAT = declareError('The requested post if malformed. Please check its raw data.');
function parsePost(meta: WebdavFile, raw: string): Post{
    const etyMetaRaw = raw.match(/---\n(.|\n)+\n---/gm);
    if(!etyMetaRaw) throw new AppError(PARSE_POST_FORMAT, "File is not a valid 11ty .md file");

    try {
        const etyMeta = etyMetaRaw[0].replace(/---/g, '');
        // TODO: add supports for tags
        const partialPost: Pick<Post, "title" | "description" | "createdAt" | "draft"> & { cover: string  } = yaml.parse(etyMeta);
        const content = raw.replace(etyMetaRaw[0], '');

        return {
            file: meta.basename,
            weight: meta.size,
            createdAt: new Date(partialPost.createdAt),
            updatedAt: new Date(meta.lastmod),
            cover: partialPost.cover,
            description: partialPost.description,
            title: partialPost.title,
            draft: partialPost.draft,
            content
        }
    } catch (e) {
        throw new AppError(PARSE_POST_FORMAT, (e as object).toString());
    }
}

export const EDIT_POST_FAIL = declareError("Unable to save your post. There is maybe something wrong on our end, but please check your connection.");
export const EDIT_POST_DENY = declareError("You do not have access to this post. Please check your credentials.");
export const EDIT_POST_FALSE = declareError("Unable to save your post. There is something wrong on our end, please report this issue to your administrator.");
export async function editPost(client: Webdav, post: Post): Promise<boolean> {
    const content = formatPost(post);
    let response;
    try {
        response = await client.putFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/${post.file}`, content, { overwrite: true });
    } catch (e) {
        throw new AppError(EDIT_POST_FAIL, (e as object).toString());
    }

    if(!response.ok) {
        let code = EDIT_POST_FAIL;
        if(response.status === 401 || response.status === 403) code = EDIT_POST_DENY;
        if(response.status === 412) code = EDIT_POST_FALSE;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }
    return response.status !== 202;
}

export const DELETE_POST_FAIL = declareError('Unable to delete your post. There is maybe something wrong on our end, but please check your connection.');
export const DELETE_POST_DENY = declareError('You do not have access to this post. Please check your credentials.'); 
export async function deletePost(client: Webdav, post: Post) {
    let response;
    try {
        response = await client.deleteFile(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/${post.file}`);
    } catch (e) {
        throw new AppError(DELETE_POST_FAIL, (e as object).toString());
    }
    if(!response.ok && response.status !== 404) {
        let code = DELETE_POST_FAIL;
        if(response.status === 401 || response.status === 403) code = DELETE_POST_DENY;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }
}

export const FETCH_POSTS_FAIL = declareError('Unable to retireve your posts. There is maybe something wrong on our end, but please check your connection.');
export const FETCH_POSTS_DENY = declareError('You do not have access to these posts. Please check your credentials.');
export const FETCH_POSTS_NOTFOUND = declareError('At least on of these posts does not exsist (anymore ?). Please notice this issue to your administrator.')
export async function fetchPosts(client: Webdav): Promise<Post[]> {
    let response;
    try {
        response = await client.getDirectoryContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}`);
    } catch (e) {
        throw new AppError(FETCH_POSTS_FAIL, (e as object).toString());
    }

    if(!response.ok) {
        let code = FETCH_POSTS_FAIL;
        if(response.status === 401 || response.status === 403) code = FETCH_POSTS_DENY;
        if(response.status === 404) code = FETCH_POSTS_NOTFOUND;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }

    let files: WebdavFile[] = [];
    try {
        files = await response.json();
    } catch (e) {
        throw new AppError(FETCH_POSTS_FAIL, (e as object).toString());
    }

    const postsMeta = files.filter((f) => f.basename.endsWith(".md"));

    let postsResponses = [];
    try {
        postsResponses = await Promise.all(
            postsMeta
                .map((f) => client.getFileContents(f.filename))
        );
    } catch (e) {
        throw new AppError(FETCH_POSTS_FAIL, (e as object).toString());
    }

    postsResponses = postsResponses.filter((response) => {
        if(!response.ok) console.error(`${response.url} -> ${response.status}: ${response.statusText}`);
        return response.ok;
    }).map((response) => response.text());

    let postsData: string[] = [];
    try {
        postsData = await Promise.all(postsResponses);
    } catch (e) {
        throw new AppError(FETCH_POSTS_FAIL, (e as object).toString());
    }


    const posts = postsMeta.map((meta, index) => {
        try {
            return parsePost(meta, postsData[index])
        } catch (e) {
            // will print PARSE_POST_FORMAT error
            console.error(e);
            return null;
        }
    }).filter((f) => !!f) as Post[];
    return posts;
}