
const { sanitize, escapeForHtmlAttr } = require('./../misc/utils')
class Style {
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
                    <link rel="stylesheet" href="/style.css">
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

module.exports = Style;