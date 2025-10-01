import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { DefaultArticle, type Article } from '../types';

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

    render() {
        return html`
            <span>${this.article.title}</span>
            <button type="button">Editer</button>
            <button type="button">Supprimer</button>
        `
    }
}