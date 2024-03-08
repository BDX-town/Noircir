import React, { createContext, useContext } from "react";
import * as webdav from "webdav/web";


import { Blog } from "types/src/Blog";
import { Post } from "types/src/Post";
import { Media } from "types/src/Media";

import { fetchBlog, editBlog as editBlogService, FETCH_BLOG_DENY } from "../services/blogs";
import { fetchMedia, deleteMedia as deleteMediaService, putMedia as putMediaService } from "../services/media";
import { fetchPosts, deletePost as deletePostService, editPost as editPostService } from "../services/posts";
import { AppError, declareError } from "./AppError";
import { WebdavClient } from "../types/webdav";
import { changePassword as changePasswordService } from "../services/settings";

interface IAppContext {
    client: WebdavClient | undefined,
    blog: Blog;
    posts: Post[];
    media: Media[];

    actions: {
        refresh: (c?: WebdavClient) => Promise<unknown>
        login: (u: string, p: string, t?: boolean) => Promise<WebdavClient>,
        logout: () => void,
        editBlog: (b: Blog) => Promise<void>,
        editPost: (p: Post) => Promise<void>,
        deletePost: (p: Post) => Promise<void>,
        deleteMedia: (m: Media) => Promise<void>,
        putMedia: (m: Media) => Promise<Media>,
        loadMedia: () => Promise<void>
        changePassword: (s: string) => Promise<void>,
    }
}

function save(context: Partial<IAppContext>) {
    // I know this is not that call to store that in sessionStorage, however given that webdav lib design, I don't know how I can do that in a better way
    // TODO: use oauth and only store token
    // https://security.stackexchange.com/questions/36958/is-it-safe-to-store-password-in-html5-sessionstorage
    sessionStorage.setItem("context", JSON.stringify({ client: context.client ? { username: context.client.username, password: context.client.password  } : undefined, actions: undefined }));
}

function load(): Partial<IAppContext> {
    const context = JSON.parse(sessionStorage.getItem("context") || "{}")  as Partial<IAppContext>
    return {
        ...context,
        // we init a new client here, restoring auth state is done via the ServiceWorker
        // it keep in memory the last auth header used
        client: context.client ? Object.assign(webdav.createClient(import.meta.env.VITE_SERVER, { authType: webdav.AuthType.Password, username: context.client.username, password: context.client.password }), { username: context.client.username, password: context.client.password }) : undefined,
    }
}
  
const AppContext = createContext<IAppContext>({} as IAppContext);

export const LOGIN_FAIL = declareError('Unable to log you in with these credentials, please check your inputs and retry.');

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const savedData = React.useRef(load());

    const [client, setClient] = React.useState<undefined | WebdavClient>(savedData.current.client as WebdavClient);
    const [blog, setBlog] = React.useState<Blog | undefined>(savedData.current.blog);
    const [posts, setPosts] = React.useState<Post[] | undefined>(savedData.current.posts);
    const [media, setMedia] = React.useState<Media[] | undefined>(savedData.current.media);

    React.useEffect(() => {
        const ctx = {
            client
        };
        save(ctx)
    }, [client]);


    const loadBlog = React.useCallback(async (fclient: WebdavClient | undefined = undefined) => {
        const blog = await fetchBlog(fclient || client as WebdavClient);
        setBlog(blog);
    }, [client]);

    const loadPosts = React.useCallback(async (fclient: WebdavClient | undefined = undefined) => {
        const posts = await fetchPosts(fclient || client as WebdavClient);
        setPosts(posts);
    }, [client]);

    const loadMedia = React.useCallback(async (fclient: WebdavClient | undefined = undefined) => {
        const media = await fetchMedia(fclient || client as WebdavClient);
        setMedia(media);
    }, [client]);

    const refresh = React.useCallback((fclient: WebdavClient | undefined = undefined) => {
        return Promise.all([loadBlog(fclient), loadPosts(fclient), loadMedia(fclient)]);
    }, [loadBlog, loadMedia, loadPosts]);

    // login
    const login = React.useCallback(async (username: string, password: string, temp: boolean = false) => {
        const c = webdav.createClient(import.meta.env.VITE_SERVER, {
            authType: webdav.AuthType.Password,
            username,
            password
        });
        const a = Object.assign(c, { username, password }) as WebdavClient;
        try {
            await fetchBlog(a);
        } catch (e) {
            const error = e as Error;
            if((error as AppError).code == FETCH_BLOG_DENY) {
                throw new AppError(LOGIN_FAIL, error.message);
            } 
            else throw e;
        }
        if(!temp) setClient(a);
        return a;
    }, []);

    const logout = React.useCallback(() => setClient(undefined), []);

    // blog 
    const editBlog = React.useCallback(async (blog: Blog) => {
        await editBlogService(client as WebdavClient, blog);
        setBlog(blog);
    }, [client]);

    // posts
    const editPost = React.useCallback(async (post: Post) => {
        await editPostService(client as WebdavClient, post);
        const index = posts?.findIndex((p) => p.file === post.file);
        if(index === -1) {
            setPosts([...(posts as Post[]), post]);
        } else {
            setPosts(posts?.map((p) => p.file === post.file ? post : p));
        }
    }, [client, posts]);

    const deletePost = React.useCallback(async (post: Post) => {
        const result = await deletePostService(client as WebdavClient, post);
        setPosts(posts?.map((p) => p.file === post.file ? null : p).filter((p) => !!p) as Post[]);
        return result;
    }, [client, posts]);

    // media 
    const putMedia = React.useCallback(async (_media: Media) => {
        const m = await putMediaService(client as WebdavClient, _media);
        setMedia([...(media as Media[]), m]);
        return m;
    }, [client, media]);

    const deleteMedia = React.useCallback(async (cmedia: Media) => {
        await deleteMediaService(client as WebdavClient, cmedia);
        setMedia(media?.map((p) => p.file === cmedia.file ? null : p).filter((p) => !!p) as Media[]);
    }, [client, media]);

    // settings
    const changePassword = React.useCallback((password: string) => changePasswordService(client as WebdavClient, password), [client]);

    React.useEffect(() => {
        if(client) {
            if(!blog) loadBlog();
            if(!posts) loadPosts();
            if(!media) loadMedia();
        }
    }, [client, blog, posts, media, loadBlog, loadPosts, loadMedia])

    const value = React.useMemo(() => ({
        client,
        blog: blog as Blog,
        posts: posts as Post[],
        media: media as Media[],
        actions: {
            refresh,
            login,
            editBlog,
            editPost,
            deletePost,
            putMedia,
            deleteMedia,
            logout,
            loadMedia,
            changePassword,
        }
    }), [client, blog, posts, media, refresh, login, editBlog, editPost, deletePost, putMedia, deleteMedia, logout, loadMedia, changePassword]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
  
  // eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};