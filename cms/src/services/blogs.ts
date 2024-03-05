import { Blog } from 'types/src/Blog';
import { WebdavClient } from '../types/webdav';
import { fetchAdapter } from './fetch';
import { AppError, declareError } from '../data/AppError';

// we make this data available to all 11ty templates 
// https://www.11ty.dev/docs/data-template-dir/

export function editBlog(client: WebdavClient, blog: Blog): Promise<boolean> {
    return client.putFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/${client.username}.json`, JSON.stringify(blog), { overwrite: true }) as Promise<boolean>
}


export const FETCH_BLOG_FAIL = declareError(`Unable to retrieve your blog from the server. There is maybe something wrong on our end, but please check your internet connection.`);
export const FETCH_BLOG_DENY = declareError(`Unable to access to this blog. Please check your credentials.`);
export async function fetchBlog(client: WebdavClient): Promise<Blog> {
    const basePath = `/${import.meta.env.VITE_BLOGS_PATH}/${client.username}`;
    const response = await fetchAdapter(client.getFileContents, `${basePath}/${client.username}.json`, { format: "text" });
    if(!response.ok) {
        let code = FETCH_BLOG_FAIL;
        if(response.status === 401 || response.status === 403) code = FETCH_BLOG_DENY;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }
    const meta = await response.json() as Blog;
    return {
        blogDescription: meta.blogDescription,
        blogName: meta.blogName,
        blogCover: meta.blogCover,
        lang: meta.lang,
    }
}