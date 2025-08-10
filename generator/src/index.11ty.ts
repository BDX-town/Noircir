import ReactDOM from "react-dom/server.js";
import React from 'react'
// @ts-expect-error no typedef
import path from 'path'

import { Index as IndexComponent} from 'template'
import { Post } from "types/src/Post";
import { Blog } from "types/src/Blog";
import { PageMeta, TemplateBlog } from "./types";

type IndexProps = TemplateBlog & { page: PageMeta} & { collections: { all: PageMeta[] }}

class Index {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "htmlIndex.11ty.js",
        }
    }

    render(props: IndexProps) {
        const blog: Blog = {
            cover: props.blogCover,
            description: props.blogDescription,
            lang: props.lang as Blog["lang"],
            name: props.blogName,
            fediverse: props.fediverse
        }

        const pages = props.collections.all.filter((p) => p.url.startsWith(path.dirname(props.page.url)))
            .sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime())
            .filter((post) => !post.data.draft);
        return ReactDOM.renderToStaticMarkup(React.createElement(IndexComponent, { ...props, pages, blog }));
    }

}

export default Index