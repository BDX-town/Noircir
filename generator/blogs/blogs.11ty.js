const ReactDOM = require('react-dom/server');
const React = require('react');
const { Index: IndexComponent } = require('template');

class Index {
    data() {
        console.log(this);
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "html.11ty.js",
            pagination: {
                data: "blogs",
                size: 1,
                alias: "blog"
            },
            permalink: (data) => `${data.blog.username}/index.html`,
        }
    }

    render(props) {
        const pages = props.collections.all.filter((p) => p.url.startsWith(props.page.url) && props.page.url !== p.url);
        return ReactDOM.renderToStaticMarkup(React.createElement(IndexComponent, { ...props, ...props.blog, pages }));
    }

}

module.exports = Index;