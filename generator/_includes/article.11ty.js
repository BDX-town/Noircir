class Article {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "base.11ty.js"
        }
    }

    render({ title, cover, description, content, blogName, blogDescription }) {
        return `
            <header>
                <h2>${blogName}</h2>
                <p>
                    ${blogDescription}
                </p>
            </header>
            <main>
                <h1>${title}</h1>
                <img src="${cover}" />
                <p>${description}</p>
                <article>
                    ${content}
                </article>
            </main>
        `
    }
}

module.exports = Article;