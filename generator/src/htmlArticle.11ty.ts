import ReactDOM from "react-dom/server.js";
import React from 'react'
import { HTMLArticle as HTMLArticleCmp } from 'template'
import { TemplateBlog } from "./types";
import { Post } from "types/src/Post";
import { Blog } from "types/src/Blog";

class HTMLArticle {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            style: "/style.css",
        }
    }

    render(props: TemplateBlog & Post) {
        const blog: Blog = {
                    cover: props.blogCover,
                    description: props.blogDescription,
                    lang: props.lang as Blog["lang"],
                    name: props.blogName,
                    fediverse: props.fediverse
                }
        
                const post: Post = {
                    content: props.content,
                    createdAt: props.createdAt,
                    description: props.description,
                    draft:props.draft,
                    file: props.file,
                    title: props.title,
                    updatedAt: props.updatedAt,
                    weight: props.weight,
                    cover: props.cover
                }
        
        return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(React.createElement(HTMLArticleCmp, {...props, blog, post}))}`;
    }
}

export default HTMLArticle