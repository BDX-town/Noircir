import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { DefaultArticle, type Article } from '../types';
import { Router } from '@vaadin/router';
import { deleteArticle } from '../services/articles';

@customElement('article-item')
export default class ArticleItem extends LitElement {

    static styles = css`
        :host {
            display: flex;
            align-items: center;
            gap: var(--spacing-2);
        }
    `

    @property({ type: Object })
    article: Article = DefaultArticle

    private requestReloadEvent: CustomEvent = new CustomEvent('request-reload');

    constructor() {
        super();
    }

    onEdit() {
        Router.go('/write/' + this.article.id)
    }

    async onDelete() {
        // TODO: enable revert
        const result = window.confirm(`Êtes-vous sûrs de vouloir supprimer ${this.article.title} ?`)
        if(!result) return;
        // TODO: handle errors
        await deleteArticle(this.article)
        this.dispatchEvent(this.requestReloadEvent)
    }

    render() {
        return html`
            <span>${this.article.title}</span>
            <button type="button" @click=${this.onEdit}>Editer</button>
            <button type="button" @click=${this.onDelete}>Supprimer</button>
        `
    }
}