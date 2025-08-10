import ReactDOM from "react-dom/server.js";
import React from 'react';
import { HTMLArticle as HTMLArticleCmp } from 'template';
class HTMLArticle {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            style: "/style.css",
        };
    }
    render(props) {
        const blog = {
            cover: props.blogCover,
            description: props.blogDescription,
            lang: props.lang,
            name: props.blogName,
            fediverse: props.fediverse
        };
        const post = {
            content: props.content,
            createdAt: props.createdAt,
            description: props.description,
            draft: props.draft,
            file: props.file,
            title: props.title,
            updatedAt: props.updatedAt,
            weight: props.weight,
            cover: props.cover
        };
        return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(React.createElement(HTMLArticleCmp, { ...props, blog, post }))}`;
    }
}
export default HTMLArticle;
