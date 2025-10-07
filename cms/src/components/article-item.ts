import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { DefaultArticle, type Article } from '../types';
import { Router } from '@vaadin/router';
import { deleteArticle } from '../services/articles';
import { client } from '../services/client';


export type DeleteArticleEvent = CustomEvent & {
    detail: Article
}

@customElement('article-item')
export default class ArticleItem extends LitElement {

    static styles = css`
        :host {
            display: flex;
            align-items: center;
            gap: var(--spacing-2);
        }

        span {
            flex-grow: 1;
        }
    `

    @property({ type: Object })
    article: Article = DefaultArticle

    constructor() {
        super();
    }

    onEdit() {
        Router.go('/write/' + encodeURIComponent(this.article.id))
    }

    onSee() {
        const a = document.createElement('a')
        a.target = "_blank"
        a.href = `${import.meta.env.VITE_SERVER}/${client?.username}/${encodeURIComponent(this.article.id.replace('.md', ''))}`
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a)
    }

    async onDelete() {
        // TODO: enable revert
        const result = window.confirm(`Êtes-vous sûrs de vouloir supprimer ${this.article.title} ?`)
        if(!result) return;
        // TODO: handle errors
        await deleteArticle(this.article)
        this.dispatchEvent(new CustomEvent('delete-article', { bubbles: true, cancelable: true, composed: true, detail: this.article }) as DeleteArticleEvent)
    }

    render() {
        return html`
            <span>${this.article.title}</span>
            <button type="button" @click=${this.onSee}>Voir</button>
            <button type="button" @click=${this.onEdit}>Editer</button>
            <button type="button" @click=${this.onDelete}>Supprimer</button>
        `
    }
}