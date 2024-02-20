const ReactDOM = require('react-dom/server');
const React = require('react');
const path = require('path');
const { Index: IndexComponent } = require('template');

class Index {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "html.11ty.js",
        }
    }

    render(props) {
        const pages = props.collections.all.filter((p) => p.url.startsWith(path.dirname(props.page.url)));
        return ReactDOM.renderToStaticMarkup(React.createElement(IndexComponent, { ...props, pages }));
    }

}

module.exports = Index;