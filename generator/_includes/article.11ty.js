
const { sanitize, escapeForHtmlAttr } = require('./../misc/utils')
class Article {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
        }
    }

    async render(props) {
        const article = {
            title: props.title,
            description: props.description,
            coverUrl: props.cover,
            updatedAt: new Date(props.updatedAt),
            url: props.page.url
        }

        const blog = {
            title: props.blogName,
            coverUrl: props.blogCover,
            description: props.blogDescription
        }

        const r =  `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${blog.title} - ${article.title}</title>
                    <link rel="icon" href=${blog.coverUrl}>
                    <link rel="stylesheet" href="/style.css">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta property="og:title" content="${blog.title} - ${article.title}">
                    <meta property="og:description" content=${article.description}>
                    <meta property="og:image" content=${article.coverUrl}>
                    <meta property="og:type" content="website">
                    <meta name="twitter:title" content="${blog.title} - ${article.title}">
                    <meta name="twitter:description" content=${article.description}>
                    <meta name="twitter:image" content=${article.coverUrl}>
                </head>
                <body>
                    <blog-article blog='${escapeForHtmlAttr(JSON.stringify(blog))}' article='${escapeForHtmlAttr(JSON.stringify(article))}'>
                        ${sanitize(props.content)}
                    </blog-article>
                </body>
            </html>
        `;

        return r;
    }
}

module.exports = Article;