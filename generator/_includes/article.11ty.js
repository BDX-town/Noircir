class Article {
    data() {
        return {
            templateEngineOverride: "11ty.js, md"
        }
    }

    render({ title, cover, description, content }) {
        return `
            <h1>${data.title}</h1>
            <img src="${data.cover}" />
            <p>${data.description}</p>
            <article>
                ${data.content}
            </article>
        `
    }
}

module.exports = Article;