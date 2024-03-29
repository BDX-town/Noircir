import { Blog } from 'types/src/Blog';
import { AppError, declareError } from '../data/AppError';
import { Webdav } from './webdav';

// we make this data available to all 11ty templates 
// https://www.11ty.dev/docs/data-template-dir/


export const EDIT_BLOG_FAIL = declareError('Unable to update your blog informations. There is maybe something wrong on our end, but please check your connection.');
// probably wrong configuration rights for nginx user
export const EDIT_BLOG_DENY = declareError('Unable to edit your blog informations, please check your credentials.')
// the filesystem refused to edit the file, that's not normal since we used overwrite true
export const EDIT_BLOG_FALSE = declareError('Your blog informations were not edited, please report that issue to the administrator.')
export async function editBlog(client: Webdav, blog: Blog): Promise<boolean> {
    let response;
    // since overwrite is true, putFileContents can not return false 
    try {
        response = await client.putFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/${client.username}.json`, JSON.stringify(blog), { overwrite: true });
    } catch (e) {
        throw new AppError(EDIT_BLOG_FAIL, (e as object).toString());
    }
    if(!response.ok) {
        let code = EDIT_BLOG_FAIL;
        if(response.status === 401 || response.status === 402) code = EDIT_BLOG_DENY;
        if(response.status === 412) code = EDIT_BLOG_FALSE;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }
    return response.status !== 202;
}


export const FETCH_BLOG_FAIL = declareError(`Unable to retrieve your blog from the server. There is maybe something wrong on our end, but please check your internet connection.`);
// probably some bad file access conf for nginx user
export const FETCH_BLOG_DENY = declareError(`Unable to access to this blog. Please check your credentials.`);
export async function fetchBlog(client: Webdav): Promise<Blog> {
    const basePath = `/${import.meta.env.VITE_BLOGS_PATH}/${client.username}`;
    let response;
    try {
        response = await client.getFileContents(`${basePath}/${client.username}.json`);
    } catch (e) {
        throw new AppError(FETCH_BLOG_FAIL, (e as object).toString());
    }
    if(!response.ok) {
        let code = FETCH_BLOG_FAIL;
        if(response.status === 401 || response.status === 403) code = FETCH_BLOG_DENY;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }
    try {
        const meta = await response.json() as Blog;
        return {
            blogDescription: meta.blogDescription,
            blogName: meta.blogName,
            blogCover: meta.blogCover,
            lang: meta.lang,
        }
    } catch (e) {
        // badly formated json
        const error = e as Error;
        throw new AppError(FETCH_BLOG_FAIL, error.message || (e as object).toString())
    }
}