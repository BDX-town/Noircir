import ReactDOM from "react-dom/server.js";
import React from 'react'
import { HTMLArticle as HTMLArticleCmp } from 'template'

class HTMLArticle {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            style: "/style.css",
        }
    }

    render(props) {
        return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(React.createElement(HTMLArticleCmp, {...props, ...(props.blog ? props.blog : {})}))}`;
    }
}

export default HTMLArticle