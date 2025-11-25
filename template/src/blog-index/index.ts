import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import './../blog-logo/index.js'
import './../blog-description/index.js'
import './../blog-footer/index.js'
import './../article-item/index.js'
import type { Article, Blog } from "../types.js";

/**
 * Shows the blog index showing a listing of all articles 
 */
@customElement('blog-index')
class Index extends LitElement {
    @property({ type: Object})
    blog: Blog = {
        coverUrl: "<cover-url-goes-here>",
        title: "<title-goes-here>",
        description: "<description-goes-here>"
    }

    @property({ type: Array })
    articles: Article[] = []

    static styles = css`
        :host {
            padding-top: var(--spacing-3);
            padding-bottom: var(--spacing-3);
            padding-left: var(--spacing-4);
            padding-right: var(--spacing-4);

            max-width: 750px;
            margin-left: auto;
            margin-right: auto;

            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: calc(var(--spacing-4) * 1.5);

            position: relative;
        }


        header {
            display: flex;
            flex-direction: column;
            gap: calc(var(--spacing-4));
        }

        main {
            display: flex;
            flex-grow: 1;
            gap: var(--spacing-4);
            flex-wrap: wrap;
            justify-content: center;
        }
    `


    render() {
        return html`
            <header>
                <blog-logo>${this.blog.title}</blog-logo>
                <blog-description blog=${JSON.stringify(this.blog)}></blog-description>
            </header>
            <main>
                ${
                    this.articles.map((a) => html`
                        <article-item article=${JSON.stringify(a)}></article-item>
                    `)
                }
            </main>
            <blog-footer></blog-footer>
        `
    }
}
