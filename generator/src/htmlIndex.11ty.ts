import ReactDOM from "react-dom/server.js";
import React from 'react'
import { HTMLIndex as HTMLIndexCmp }  from 'template'
import { TemplateBlog } from "./types";
import { Blog } from "types/src/Blog";

type HTMLIndexProps = TemplateBlog & { content: string }

class HTMLIndex {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            style: "/style.css",
        }
    }

    render(props: HTMLIndexProps) {
        const blog: Blog = {
            cover: props.blogCover,
            description: props.blogDescription,
            lang: props.lang as Blog["lang"],
            name: props.blogName,
            fediverse: props.fediverse
        }


        return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(React.createElement(HTMLIndexCmp, { ...props, blog }))}`;
    }
}

export default HTMLIndex