import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { DefaultArticle, type Article } from '../types';
import { Router } from '@vaadin/router';

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

    constructor() {
        super();
    }

    onEdit = () => {
        Router.go('/write/' + this.article.id)
    }

    render() {
        return html`
            <span>${this.article.title}</span>
            <button type="button" @click=${this.onEdit}>Editer</button>
            <button type="button">Supprimer</button>
        `
    }
}