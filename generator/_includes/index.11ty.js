import ReactDOM from "react-dom/server.js";
import React from 'react';
// @ts-expect-error no typedef
import path from 'path';
import { Index as IndexComponent } from 'template';
class Index {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "htmlIndex.11ty.js",
        };
    }
    render(props) {
        const pages = props.collections.all.filter((p) => p.url.startsWith(path.dirname(props.page.url)))
            .sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime())
            .filter((post) => !post.data.draft);
        return ReactDOM.renderToStaticMarkup(React.createElement(IndexComponent, { ...props, pages }));
    }
}
export default Index;
