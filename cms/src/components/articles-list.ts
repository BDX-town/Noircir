import { html, css, LitElement} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { Article } from '../types';
import { findArticles } from '../services/articles';
import { Router } from '@vaadin/router'

import './article-item'

@customElement('articles-list')
export default class ArticlesList extends LitElement {

    static styles = css`
        ul {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-3);
        }
    `

    @property({ type: Array})
    articles: Article[] | undefined

    constructor() {
        super();
        this.fetchArticles()
    }

    async fetchArticles() {
        this.articles = undefined
        const articles = await findArticles()
        this.articles = articles
    }

    onWrite() {
        Router.go('/write')
    }

    render() {
        // TODO: handle loading
        if(!this.articles) return html`Chargement...`

        return html`
            <button @click=${this.onWrite} type="button">Ecrire</button>
            <ul>
                ${
                    this.articles.map((a) => html`<article-item .article=${a} @request-reload=${this.fetchArticles}></article-item>`)
                }
            </ul>
        `
    }
}