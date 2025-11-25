import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Article } from './../../src/types.js'

/**
 * Shows an article item in a article listing 
 */
@customElement('article-item')
class ArticleItem extends LitElement {
    @property({ type: Object })
    article: Article = {
        coverUrl: "<cover-goes-here>",
        description: "<description-goes-here>",
        tags: ["<tags-go-here>"],
        title: "<title-goes-here>",
        updatedAt: new Date(),
        url: "<url-goes-here>"
    }

    static styles = css`
        h2, p {
            margin: 0;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        article {
            z-index: 0;
            cursor: pointer;
            max-width: 350px;
            min-height: 300px;
            overflow: hidden;
            position: relative;
            isolation: isolate;
            box-sizing: border-box;
            display: flex;
            transform: translateX(0) translateY(0);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            flex-direction: column;
            justify-content: flex-end;
            border-radius: var(--spacing-2);
            box-shadow:
                hsla(var(--color-primary-h), var(--color-primary-s), var(--color-primary-l), 0.4) 5px 5px,
                hsla(var(--color-tertiary-h), var(--color-tertiary-s), var(--color-tertiary-l), 0.3) 10px 10px;


        }

        article::before {
            z-index: -1;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(to bottom, #402141ff, #f7405fff, #fcc77fff, #fff8f1);
            mask-size: cover;
            mask-position: bottom left;
            mask-image: url('assets/dots.png');
        }


        article:hover {
            transform: translateX(-2.5px) translateY(-2.5px);
            box-shadow:
                hsla(var(--color-primary-h), var(--color-primary-s), var(--color-primary-l), 0.4) 5px 5px,
                hsla(var(--color-tertiary-h), var(--color-tertiary-s), var(--color-tertiary-l), 0.3) 10px 10px,
                hsla(var(--color-tertiary-h), var(--color-tertiary-s), var(--color-tertiary-l), 0.2) 15px 15px;
        }

        img {
            z-index: -1;
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }

        .meta {
            margin: var(--spacing-2);
            padding-top: var(--spacing-2);
            padding-bottom: var(--spacing-1);
            padding-left: var(--spacing-2);
            padding-right: var(--spacing-2);
            background: white;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2);
            border-radius: var(--spacing-2);
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
        }

        .meta>div>date {
            flex-grow: 1;
            text-align: right;
            font-weight: 300;
            color: var(--grey-300);
        }

        .meta>div>span {
            color: var(--color-primary);
            font-weight: 600;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    `

    render() {
        return html`
            <a href=${this.article.url}>
                <article>
                    <simg src=${this.article.coverUrl} />
                    <div class="meta">
                        <h2>${this.article.title}</h2>
                        <p>${this.article.description}</h2>
                        <div>
                            ${this.article.tags ? html`<span>${this.article.tags[0]}</span>` : ''}
                            <date>${new Date(this.article.updatedAt).toLocaleDateString()}</date>
                        </div>
                    <div>
                </article>
            </a>
        `
    }
}