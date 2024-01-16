import React, { createContext, useContext } from "react";

import { CURRENT_BLOG } from "../services/client";
import { Blog } from "../types/Blog";
import { Post } from "../types/Post";
import { Media } from "../types/Media";

import { fetchBlog } from "../services/fetchBlog";
import { fetchMedia } from "../services/fetchMedia";
import { fetchPosts } from "../services/fetchPosts";
import { AppError } from "./AppError";

interface IAppContext {
    blog: Blog;
    posts: Post[];
    media: Media[];

    globalErrors: AppError[],

    actions: {
        refresh: () => Promise<unknown>
    }
}
  
const AppContext = createContext<Partial<IAppContext>>({});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [globalErrors, setGlobalErrors] = React.useState<AppError[]>([]);
    const [blog, setBlog] = React.useState<Blog | undefined>(undefined);
    const [posts, setPosts] = React.useState<Post[] | undefined>(undefined);
    const [media, setMedia] = React.useState<Media[] | undefined>(undefined);

    const loadBlog = React.useCallback(async () => {
        try {
            const blog = await fetchBlog();
            setBlog(blog);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your blog. Please check your internet connection or retry later.", true);
            setGlobalErrors([...globalErrors, ue]);
        }
    }, [globalErrors]);

    const loadPost = React.useCallback(async () => {
        try {
            const posts = await fetchPosts(CURRENT_BLOG);
            setPosts(posts);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your posts. Please check your internet connection or retry later.", true);
            setGlobalErrors([...globalErrors, ue]);
        }
    }, [globalErrors]);

    const loadMedia = React.useCallback(async () => {
        try {
            const media = await fetchMedia(CURRENT_BLOG);
            setMedia(media);
        } catch (e) {
            console.error(e);
            const ue = new AppError(new Error((e as Error).message), "Unable to retrieve your media. Please check your internet connection or retry later.", true);
            setGlobalErrors([...globalErrors, ue]);
        }
    }, [globalErrors]);

    const refresh = React.useCallback(() => {
        return Promise.all([loadBlog(), loadPost(), loadMedia()]);
    }, [loadBlog, loadMedia, loadPost]);

    const value = React.useMemo(() => ({
        blog,
        posts,
        media,
        globalErrors,
        actions: {
            refresh
        }
    }), [blog, globalErrors, media, posts, refresh]);


    React.useEffect(() => {
        refresh();
    }, [refresh])

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
  
  // eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};