import ReactDOM from "react-dom/server.js";
import React from 'react';
import { HTMLIndex as HTMLIndexCmp } from 'template';
class HTMLIndex {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            style: "/style.css",
        };
    }
    render(props) {
        return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(React.createElement(HTMLIndexCmp, { ...props, ...(props.blog ? props.blog : {}) }))}`;
    }
}
export default HTMLIndex;
