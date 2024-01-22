import React, { createContext, useContext } from "react";
import * as webdav from "webdav/web";


import { CURRENT_BLOG } from "../services/client";
import { Blog } from "../types/Blog";
import { Post } from "../types/Post";
import { Media } from "../types/Media";

import { fetchBlog, editBlog as editBlogService } from "../services/blogs";
import { fetchMedia, deleteMedia as deleteMediaService, putMedia as putMediaService } from "../services/media";
import { fetchPosts, deletePost as deletePostService, editPost as editPostService } from "../services/posts";
import { AppError } from "./AppError";

interface IAppContext {
    client: unknown,
    blog: Blog;
    posts: Post[];
    media: Media[];

    actions: {
        refresh: (c?: unknown) => Promise<unknown>
        login: (u: string, p: string) => unknown,
        logout: () => void,
        editBlog: (b: Blog) => Promise<boolean>,
        editPost: (p: Post) => Promise<boolean>,
        deletePost: (p: Post) => Promise<void>,
        deleteMedia: (m: Media) => Promise<void>,
        putMedia: (m: Media) => Promise<void>,
    }
}
  
const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [client, setClient] = React.useState<unknown>(undefined);
    const [blog, setBlog] = React.useState<Blog | undefined>(undefined);
    const [posts, setPosts] = React.useState<Post[] | undefined>(undefined);
    const [media, setMedia] = React.useState<Media[] | undefined>(undefined);

    const loadBlog = React.useCallback(async (fclient: unknown = undefined) => {
        try {
            const blog = await fetchBlog(fclient || client);
            setBlog(blog);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your blog. Please check your internet connection or retry later.", true);
            throw ue;
        }
    }, [client]);

    const loadPost = React.useCallback(async (fclient: unknown = undefined) => {
        try {
            const posts = await fetchPosts(fclient || client, CURRENT_BLOG);
            setPosts(posts);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your posts. Please check your internet connection or retry later.", true);
            throw ue;
        }
    }, [client]);

    const loadMedia = React.useCallback(async (fclient: unknown = undefined) => {
        try {
            const media = await fetchMedia(fclient || client, CURRENT_BLOG);
            setMedia(media);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your media. Please check your internet connection or retry later.", true);
            throw ue;
        }
    }, [client]);

    const refresh = React.useCallback((fclient: unknown = undefined) => {
        return Promise.all([loadBlog(fclient), loadPost(fclient), loadMedia(fclient)]);
    }, [loadBlog, loadMedia, loadPost]);

    // login
    const login = React.useCallback((username: string, password: string) => {
        const c = webdav.createClient(import.meta.env.VITE_SERVER, {
            authType: webdav.AuthType.Password,
            username,
            password
        });
        setClient(c);
        return c;
    }, []);

    const logout = React.useCallback(() => setClient(undefined), []);

    // blog 
    const editBlog = React.useCallback(async (blog: Blog) => {
        const result = await editBlogService(client, blog);
        if(result) {
            setBlog(blog);
        }
        return result;
    }, [client]);

    // posts
    const editPost = React.useCallback(async (post: Post) => {
        const result = await editPostService(client, blog as Blog, post);
        if(result) {
            const index = posts?.findIndex((p) => p.file === post.file);
            if(index === -1) {
                setPosts([...(posts as Post[]), post]);
            } else {
                setPosts(posts?.map((p) => p.file === post.file ? post : p));
            }
        }
        return result;
    }, [blog, client, posts]);

    const deletePost = React.useCallback(async (post: Post) => {
        const result = await deletePostService(client, blog as Blog, post);
        setPosts(posts?.map((p) => p.file === post.file ? null : p).filter((p) => !!p) as Post[]);
        return result;
    }, [blog, client, posts]);

    // media 
    const putMedia = React.useCallback(async (_media: Media) => {
        await putMediaService(client, _media);
        setMedia([...(media as Media[]), _media]);
    }, [client, media]);

    const deleteMedia = React.useCallback((media: Media) => {
        return deleteMediaService(client, media);
    }, [client]);

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
        }
    }), [blog, client, deleteMedia, deletePost, editBlog, editPost, login, logout, media, posts, putMedia, refresh]);

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