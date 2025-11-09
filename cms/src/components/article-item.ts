import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { DefaultArticle, type Article } from '../types';
import { Router } from '@vaadin/router';
import { deleteArticle } from '../services/articles';
import { client } from '../services/client';
import { Styles } from '../styles';


export type DeleteArticleEvent = CustomEvent & {
    detail: Article
}

@customElement('article-item')
export default class ArticleItem extends LitElement {

    static styles = css`
        ${Styles}

        :host {
            display: flex;
            align-items: center;
            gap: var(--spacing-2);
        }

        button {
            font-size: 1.2rem;
            min-width: 45px;
            max-width: 45px;
            height: 45px;
        }

        div {
            flex-grow: 1;
            font-size: 1.1rem;
            font-weight: 500;
            font-family: var(--font-secondary);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            min-width: 0;
            flex-shrink: 1;
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
        a.href = `${import.meta.env.SERVER}/${client?.username}/${encodeURIComponent(this.article.id.replace('.md', ''))}`
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
            <div>${this.article.title}</div>
            <button type="button" class="secondary" @click=${this.onSee}>◎</button>
            <button type="button" class="secondary" @click=${this.onEdit}>✐</button>
            <button type="button" class="secondary" @click=${this.onDelete}>⌫</button>
        `
    }
}