import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import '../components/article-form'
import '../components/articles-list'
import { DefaultArticle, type Article } from "../types";
import { Router } from "@vaadin/router";
import { findArticles } from "../services/articles";

@customElement('view-index')
export default class ViewIndex extends LitElement {


    private location: any;

    static styles = css`
        :host {
            display: flex;
            flex-grow: 1;
            gap: var(--spacing-2);
        }

        articles-list {
            padding: var(--spacing-2);
            position: sticky;
            top: var(--spacing-2);
        }

        articles-list[expanded] {
            min-width: 400px;
        }

        article-form {
            flex-grow: 1;
        }
    `
    @property({ type: Object })
    article: Article | undefined;

    connectedCallback(): void {
        super.connectedCallback();
        const { basename } = this.location.params;
        this.fetchArticle(basename)
    }

    async fetchArticle(basename: string) {
        // we are creating a new article 
        if (!basename) {
            this.article = DefaultArticle
            return;
        }
        // TODO: handle errors 
        const articles = await findArticles();
        const article = articles.find((a) => a.id === basename)
        if (!article) {
            Router.go('not-found')
            return;
        }
        this.article = article;
    }


    render() {
        return html`
            <articles-list></articles-list>
            ${
                this.article ? html`<article-form .article=${this.article}></article-form>` : 'Chargement...'
            }
        `
    }
}