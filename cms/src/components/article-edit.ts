import { html, LitElement } from 'lit'
import { property, customElement } from 'lit/decorators.js'

import './article-form'
import { type Article } from '../types';
import { Router } from '@vaadin/router';
import { findArticles } from '../services/articles';

@customElement('article-edit')
export default class ArticleEdit extends LitElement {

    private location: any;

    @property({ type: Object })
    article: Article | undefined;

    connectedCallback(): void {
        super.connectedCallback();
        const { basename } = this.location.params;
        this.fetchArticle(basename)
    }

    async fetchArticle(basename: string) {
        if(!basename) {
            Router.go('not-found')
            return;
        }
        // TODO: handle errors 
        const articles = await findArticles();
        const article = articles.find((a) => a.id === basename)
        if(!article) {
            Router.go('not-found')
            return;
        }
        this.article = article;
    }

    render() {
        if(!this.article) return html`chargement...`
        return html`
            <article-form .article=${this.article}></article-form>
        `
    }
}