import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import './../blog-logo/index.js'
import './../article-cover/index.js'
import './../blog-description/index.js'
import './../blog-footer/index.js'
import './../article-item/index.js'
import type { Article, Blog } from "../types.js";

function fromAttribute(value: string) {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

/**
 * Shows an article in a full page
 */
@customElement('blog-article')
class BlogArticle extends LitElement {

    @property({ type: Object })
    article: Article = {
        coverUrl: "<cover-goes-here>",
        description: "<description-goes-here>",
        tags: ["<tags-go-here>"],
        title: "<title-goes-here>",
        updatedAt: new Date(),
        url: "<url-goes-here>",
        createdAt: new Date(),
    }

    @property({ type: Object })
    blog: Blog = {
        title: "<blog-name-goes-here>",
        coverUrl: "<blog-cover-url>",
        description: "<description-goes-here>"
    }

    static styles = css`
        .blog-article {
            padding-top: var(--spacing-3);
            padding-bottom: var(--spacing-3);
            padding-left: var(--spacing-4);
            padding-right: var(--spacing-4);

            max-width: 1000px;
            margin: auto;

            display: flex;
            flex-direction: column;
            gap: calc(var(--spacing-4) * 1.5);

            position: relative;
        }

        .blog-article>header {
            display: flex;
            flex-direction: column;
            gap: calc(var(--spacing-4) * 1.5);
        }

        .main {
            p {
                line-height: 1.6;
                letter-spacing: 3%;
            }

            img { 
                max-width: 100%;
                margin: auto;
                display: block;
                border-radius: 10px;
            }
        
        }
    `

    render() {
        return html`
            <section class="blog-article">
                <header>
                    <blog-logo>${this.blog.title}</blog-logo>
                    <article-cover article=${JSON.stringify(this.article)}></article-cover>
                </header>
                <main>
                    <slot />
                </main>
                <blog-footer></blog-footer>
            </section>
        `
    }
}


