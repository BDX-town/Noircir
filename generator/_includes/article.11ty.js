const ReactDOM = require('react-dom/server');
const React = require('react');
const path = require('path');
const fs = require('fs');
const { Article: ArticleComponent } = require('template');

class Article {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "htmlArticle.11ty.js",
        }
    }

    /**
     * This weird function is in charge of generating the blog's index. At this time, I didn't find a way to do this properly while keeping the
     * desired file structure
     */
    async updateIndex(props) {
        const blogPath = path.dirname(
            path.dirname(
                props.page.outputPath
            )
        ) ;
        fs.mkdirSync(blogPath, { recursive: true })
        const indexOutputPath = path.join(
            blogPath,
            "index.html"
        );
        const content = await this.renderFile('./_includes/index.11ty.js', { ...props });
        const wrapper = await this.renderFile('./_includes/htmlIndex.11ty.js', { ...props, content })
        fs.writeFileSync(indexOutputPath, wrapper);
    }

    async render(props) {

        await this.updateIndex(props);
        return ReactDOM.renderToStaticMarkup(React.createElement(ArticleComponent, props));
    }
}

module.exports = Article;