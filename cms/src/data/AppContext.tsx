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
        refresh: () => Promise<void>
    }
}
  
const AppContext = createContext<Partial<IAppContext>>({});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [globalErrors, setGlobalErrors] = React.useState<AppError[] | undefined>(undefined);
    const [blog, setBlog] = React.useState<Blog | undefined>(undefined);
    const [posts, setPosts] = React.useState<Post[] | undefined>(undefined);
    const [media, setMedia] = React.useState<Media[] | undefined>(undefined);

    const refresh = React.useCallback(async () => {
        // TODO: retrieve blog without static var 
        const fblog = fetchBlog().then(setBlog);
        const fposts = fetchPosts(CURRENT_BLOG).then(setPosts);
        const fmedia = fetchMedia(CURRENT_BLOG).then(setMedia);
        await Promise.all([fblog, fposts, fmedia]);
    }, []);

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

    console.log(value);

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