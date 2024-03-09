import React, { createContext, useContext } from "react";


import { Blog } from "types/src/Blog";
import { Post } from "types/src/Post";
import { Media } from "types/src/Media";

import { fetchBlog, editBlog as editBlogService, FETCH_BLOG_DENY } from "../services/blogs";
import { fetchMedia, deleteMedia as deleteMediaService, putMedia as putMediaService, PUT_MEDIA_QUEUED } from "../services/media";
import { fetchPosts, deletePost as deletePostService, editPost as editPostService } from "../services/posts";
import { AppError, declareError } from "./AppError";
import { changePassword as changePasswordService } from "../services/settings";
import { createClient, Webdav } from "../services/webdav";
import { buildUrl } from "../helpers/buildUrl";

interface IAppContext {
    client: Webdav | undefined,
    blog: Blog;
    posts: Post[];
    media: Media[];

    online: boolean,

    actions: {
        refresh: (c?: Webdav) => Promise<unknown>
        login: (u: string, p: string, t?: boolean) => Promise<Webdav>,
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
        client: context.client ? createClient(import.meta.env.VITE_SERVER, { username: context.client.username, password: context.client.password }) : undefined,
    }
}
  
const AppContext = createContext<IAppContext>({} as IAppContext);

export const LOGIN_FAIL = declareError('Unable to log you in with these credentials, please check your inputs and retry.');

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [online, setOnline] = React.useState(navigator.onLine);

    const savedData = React.useRef(load());

    const [client, setClient] = React.useState<undefined | Webdav>(savedData.current.client as Webdav);
    const [blog, setBlog] = React.useState<Blog | undefined>(savedData.current.blog);
    const [posts, setPosts] = React.useState<Post[] | undefined>(savedData.current.posts);
    const [media, setMedia] = React.useState<Media[] | undefined>(savedData.current.media);

    React.useEffect(() => {
        const ctx = {
            client
        };
        save(ctx)
    }, [client]);

    const onOnline = React.useCallback(() => {
        setOnline(true);
    }, []);

    const onOffline = React.useCallback(() => {
        setOnline(false);
    }, []);

    React.useEffect(() => {
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);

        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        }
    }, [onOnline, onOffline]);

    const loadBlog = React.useCallback(async (fclient: Webdav | undefined = undefined) => {
        const blog = await fetchBlog(fclient || client as Webdav);
        setBlog(blog);
    }, [client]);

    const loadPosts = React.useCallback(async (fclient: Webdav | undefined = undefined) => {
        const posts = await fetchPosts(fclient || client as Webdav);
        setPosts(posts);
    }, [client]);

    const loadMedia = React.useCallback(async (fclient: Webdav | undefined = undefined) => {
        const media = await fetchMedia(fclient || client as Webdav);
        setMedia(media);
    }, [client]);

    const refresh = React.useCallback((fclient: Webdav | undefined = undefined) => {
        return Promise.all([loadBlog(fclient), loadPosts(fclient), loadMedia(fclient)]);
    }, [loadBlog, loadMedia, loadPosts]);

    // login
    const login = React.useCallback(async (username: string, password: string, temp: boolean = false) => {
        const c = createClient(import.meta.env.VITE_SERVER, {
            username,
            password
        });
        try {
            await fetchBlog(c);
        } catch (e) {
            const error = e as Error;
            if((error as AppError).code == FETCH_BLOG_DENY) {
                throw new AppError(LOGIN_FAIL, error.message);
            } 
            else throw e;
        }
        if(!temp) setClient(c);
        return c;
    }, []);

    const logout = React.useCallback(() => setClient(undefined), []);

    // blog 
    const editBlog = React.useCallback(async (blog: Blog) => {
        await editBlogService(client as Webdav, blog);
        setBlog(blog);
    }, [client]);

    // posts
    const editPost = React.useCallback(async (post: Post) => {
        await editPostService(client as Webdav, post);
        const index = posts?.findIndex((p) => p.file === post.file);
        if(index === -1) {
            setPosts([...(posts as Post[]), post]);
        } else {
            setPosts(posts?.map((p) => p.file === post.file ? post : p));
        }
    }, [client, posts]);

    const deletePost = React.useCallback(async (post: Post) => {
        const result = await deletePostService(client as Webdav, post);
        setPosts(posts?.map((p) => p.file === post.file ? null : p).filter((p) => !!p) as Post[]);
        return result;
    }, [client, posts]);

    // media 
    const putMedia = React.useCallback(async (_media: Media) => {
        try {
            await putMediaService(client as Webdav, _media);
        } catch (e) {
            const appError = e as AppError;
            if(appError.code === PUT_MEDIA_QUEUED) {
                const m = {
                    ..._media,
                    url: buildUrl(`/${import.meta.env.VITE_BLOGS_PATH}/${(client as Webdav).username}/ressources/${_media.file}`)
                };
                setMedia([...(media as Media[]), m]);
            }
            throw e;
        }
        const m = {
            ..._media,
            url: buildUrl(`/${import.meta.env.VITE_BLOGS_PATH}/${(client as Webdav).username}/ressources/${_media.file}`)
        };
        setMedia([...(media as Media[]), m]);
        return m;
    }, [client, media]);

    const deleteMedia = React.useCallback(async (cmedia: Media) => {
        await deleteMediaService(client as Webdav, cmedia);
        setMedia(media?.map((p) => p.file === cmedia.file ? null : p).filter((p) => !!p) as Media[]);
    }, [client, media]);

    // settings
    const changePassword = React.useCallback((password: string) => changePasswordService(client as Webdav, password), [client]);

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
        online,
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
    }), [client, blog, posts, media, online, refresh, login, editBlog, editPost, deletePost, putMedia, deleteMedia, logout, loadMedia, changePassword]);

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