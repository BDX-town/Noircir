import React, { createContext, useContext } from "react";
import * as webdav from "webdav/web";


import { CURRENT_BLOG } from "../services/client";
import { Blog } from "../types/Blog";
import { Post } from "../types/Post";
import { Media } from "../types/Media";

import { fetchBlog } from "../services/blogs";
import { fetchMedia } from "../services/media";
import { fetchPosts, deletePost as deletePostService, editPost as editPostService } from "../services/posts";
import { AppError } from "./AppError";

interface IAppContext {
    client: unknown,
    blog: Blog;
    posts: Post[];
    media: Media[];

    actions: {
        refresh: () => Promise<unknown>
        login: () => void,
        editPost: (p: Post) => Promise<boolean>,
        deletePost: (p: Post) => Promise<void>,
    }
}
  
const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [client, setClient] = React.useState<unknown>(undefined);
    const [blog, setBlog] = React.useState<Blog | undefined>(undefined);
    const [posts, setPosts] = React.useState<Post[] | undefined>(undefined);
    const [media, setMedia] = React.useState<Media[] | undefined>(undefined);

    const loadBlog = React.useCallback(async () => {
        try {
            const blog = await fetchBlog(client);
            setBlog(blog);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your blog. Please check your internet connection or retry later.", true);
            throw ue;
        }
    }, [client]);

    const loadPost = React.useCallback(async () => {
        try {
            const posts = await fetchPosts(client, CURRENT_BLOG);
            setPosts(posts);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your posts. Please check your internet connection or retry later.", true);
            throw ue;
        }
    }, [client]);

    const loadMedia = React.useCallback(async () => {
        try {
            const media = await fetchMedia(client, CURRENT_BLOG);
            setMedia(media);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your media. Please check your internet connection or retry later.", true);
            throw ue;
        }
    }, [client]);

    const refresh = React.useCallback(() => {
        return Promise.all([loadBlog(), loadPost(), loadMedia()]);
    }, [loadBlog, loadMedia, loadPost]);

    // login
    const login = React.useCallback(() => {
        const c = webdav.createClient(import.meta.env.VITE_SERVER, {
            authType: webdav.AuthType.Password,
            username: "clovis",
            password: "test"
        });
        setClient(c);
    }, []);

    // posts
    const editPost = React.useCallback(async (post: Post) => {
        const result = await editPostService(client, blog as Blog, post);
        if(result) {
            setPosts(posts?.map((p) => p.file === post.file ? post : p));
        }
        return result;
    }, [blog, client, posts]);

    const deletePost = React.useCallback(async (post: Post) => {
        const result = await deletePostService(client, blog as Blog, post);
        setPosts(posts?.map((p) => p.file === post.file ? null : p).filter((p) => !!p) as Post[]);
        return result;
    }, [blog, client, posts]);

    const value = React.useMemo(() => ({
        client,
        blog: blog as Blog,
        posts: posts as Post[],
        media: media as Media[],
        actions: {
            refresh,
            login,
            editPost,
            deletePost,
        }
    }), [blog, client, deletePost, editPost, login, media, posts, refresh]);


    React.useEffect(() => {
        if(client) refresh();
    }, [refresh, client])

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