import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import type { Article } from "../types.js";

/**
 * Shows the heading cover of an article in a full page
 */
@customElement('article-cover')
export default class ArticleCover extends LitElement {
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

    static styles = css`
        h1, p {
            margin: 0;
        }

        .cover {
            display: flex;
            gap: var(--spacing-4);
        }

        @media  screen and (max-width: 750px) {
            .cover {
                flex-wrap: wrap;
            }
        }
 

        .cover>img {
            min-width: 300px;
            max-width: 0px;
            flex-shrink: 1;
            object-fit: cover;
            border-radius: var(--spacing-2);
            box-shadow:
                hsla(var(--color-primary-h), var(--color-primary-s), var(--color-primary-l), 0.6) 5px 5px,
                hsla(var(--color-tertiary-h), var(--color-tertiary-s), var(--color-tertiary-l), 0.5) 10px 10px;
        }

        .meta {
            min-width: 30%;
            flex-grow: 1;
            padding-top: var(--spacing-2);
            padding-bottom: var(--spacing-1);
            padding-right: var(--spacing-2);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2);
            font-size: 1rem;
        }

        .meta>h2 {
            font-size: 1.2em;
            font-weight: 600;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-family: var(--font-secondary);
            text-transform: uppercase;
        }

        .meta>p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
        }

        .meta>div {
            display: flex;
            justify-content: space-between;
            gap: var(--spacing-1);
        }

        .meta>div>date {
            font-weight: 300;
            color: var(--grey-300);
        }

        .meta>div>span {
            flex-grow: 1;
            text-align: right;
            color: var(--color-primary);
            font-weight: 600;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    `

    render() {
        return html`
            <div class='cover'>
                ${this.article.coverUrl ? html`<img src=${this.article.coverUrl} />` : '' }
                <div class="meta">
                    <h1>${this.article.title}</h1>
                    <p>${this.article.description}</h2>
                    <div>
                        <date>${new Date(this.article.updatedAt).toLocaleDateString()}</date>
                        ${this.article.tags ? this.article.tags.map((t) => html`<span>${t}</span>`) : ''}
                    </div>
                <div>
            </div>
        `
    }
}