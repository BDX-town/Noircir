import { html, css, LitElement} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { Article } from '../types';
import { fetchArticles } from '../services/articles';
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
            position: sticky;
            bottom: var(--spacing-2);
        }


        ul {
            margin: 0;
            padding: var(--spacing-2);
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
        const articles = await fetchArticles()
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
                <div><button @click=${this.onExpand} type="button">&gt;&gt;</button></div>
            `
        }

        // TODO: handle loading
        if(!this.articles) return html`Chargement...`

        return html`
            <div>
                <button @click=${this.onExpand} type="button">&lt;&lt;</button>
            </div>
            <ul>
                ${
                    this.articles.map((a) => html`<article-item .article=${a} @delete-article=${this.fetchArticles}></article-item>`)
                }
            </ul>
            <button @click=${this.onWrite} type="button">Ecrire</button>
        `
    }
}