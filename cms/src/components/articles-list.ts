import { html, css, LitElement} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { Article } from '../types';
import { findArticles } from '../services/articles';
import { Router } from '@vaadin/router'

import './article-item'

@customElement('articles-list')
export default class ArticlesList extends LitElement {

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-3);
        }

        :host > button:last-of-type {
            width: 100%;
        }


        ul {
            margin: 0;
            padding: 0;
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: var(--spacing-3);
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
        // TODO: handle errors
        const articles = await findArticles()
        this.articles = articles
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
                <button @click=${this.onExpand} type="button">&gt;&gt;</button>
            `
        }

        // TODO: handle loading
        if(!this.articles) return html`Chargement...`

        return html`
            <button @click=${this.onExpand} type="button">&lt;&lt;</button>
            <ul>
                ${
                    this.articles.map((a) => html`<article-item .article=${a} @request-reload=${this.fetchArticles}></article-item>`)
                }
            </ul>
            <button @click=${this.onWrite} type="button">Ecrire</button>
        `
    }
}