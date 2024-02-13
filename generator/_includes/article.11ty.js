const ReactDOM = require('react-dom/server');
const React = require('react');
const { Article: ArticleComponent } = require('template');

class Article {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "html.11ty.js",
        }
    }

    render(props) {
        return ReactDOM.renderToStaticMarkup(React.createElement(ArticleComponent, props));
    }
}

module.exports = Article;