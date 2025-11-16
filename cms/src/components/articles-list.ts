import { html, css, LitElement} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { Article } from '../types';
import { fetchArticles } from '../services/articles';
import { Router } from '@vaadin/router'

import './article-item'
import { Styles } from '../styles';
import { AppError, declareError, LitElementWithErrorHandling } from '../utils/error';


const UNABLE_FETCH_ARTICLES_ERROR = declareError({ fatal: true, translationKey: "Une erreur est survenue lors de la récupération des articles"})
@customElement('articles-list')
export default class ArticlesList extends LitElementWithErrorHandling {

    static styles = css`
        ${Styles}

        :host {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-3);
        }

        :host > button:last-of-type {
            width: 100%;
            position: sticky;
            bottom: var(--spacing-3);
        }

        div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.2rem;
            font-family: var(--font-secondary);
            color: var(--color-secondary);
        }

        div span::after {
            content: '';
            display: block;
            width: 100%;
            height: 2px;
            background: var(--color-primary);
            margin-top: var(--spacing-1);
        }

        hr {
            border: 1px dashed var(--color-secondary);
            width: 100%;
        }


        ul {
            margin: 0;
            max-width: 100%;
            padding: var(--spacing-2);
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: 20px;
        }
    `

    @property({ type: Array})
    articles: Article[] | undefined

    @property({ type: Boolean, reflect: true})
    expanded = true


    constructor() {
        super();
        this.fetchArticles()
    }

    async fetchArticles() {
        this.articles = undefined
        try {
            const articles = await fetchArticles()
            this.articles = articles
        } catch(e) {
            console.error(e)
            this.error = new AppError(UNABLE_FETCH_ARTICLES_ERROR, e as Error)
        }
    }

    onWrite() {
        Router.go('/write')
    }

    onExpand() {
        this.expanded = !this.expanded
    }

    render() {
        if(!this.expanded) {
            return html`
                <div><button @click=${this.onExpand} type="button">⇒</button></div>
            `
        }

        let content = html`<div class="loader">↻</div>`
        if(this.articles) {
            content = html`
                <ul>
                    ${
                        this.articles.map((a) => html`<article-item .article=${a} @delete-article=${this.fetchArticles}></article-item><hr />`)
                    }
                </ul>
                <button @click=${this.onWrite} type="button">𝍌 Ecrire</button>
            `
        }

        const error = super.render();
        if(error) {
            content = error;
        }

        return html`
            <div>
                <span>Article(s)</span>
                <button @click=${this.onExpand} type="button">⇐</button>
            </div>
            ${content}
        `
    }
}