
class Style {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
        }
    }

    async render(props) {
        const { html } = await import("lit");

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

        return html`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${blog.title} - ${article.title}</title>
                </head>
                <body>
                    <blog-article .blog=${blog} .article=${article} />
                </body>
            </html>
        `;
    }
}

module.exports = Style;