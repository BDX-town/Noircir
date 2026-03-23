import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import './../components/side-menu'
import '../components/article-form'
import './../components/blog-form'
import { DefaultArticle, type Article, type Blog } from "../types";
import { Router } from "@vaadin/router";
import { fetchArticles } from "../services/articles";
import { fetchBlog as fetchBlogService } from "../services/blog";
import type { DeleteArticleEvent } from "../components/article-item";
import { Styles } from "../styles";

@customElement('view-index')
export default class ViewIndex extends LitElement {


    private location: any;

    static styles = css`
        ${Styles}

        :host {
            display: flex;
            flex-grow: 1;
        }

        :host>div {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            flex-shrink: 1;
            min-width: 300px;
            gap: var(--spacing-3);
            padding: var(--spacing-3);
        }

        :host>side-menu[expanded] {
            min-width: 400px;
            padding-left: var(--spacing-3);
            padding-top: var(--spacing-3);
            padding-bottom: var(--spacing-3);
        }

        :host>div>article-form {
            flex-grow: 1;
        }

        :host>div>button {
            align-self: flex-start;
        }
    `
    @property({ type: Object, attribute: false })
    article: Article | undefined;


    @property({ type: Object, attribute: false })
    blog: Blog | undefined;

    @property({ type: Boolean, attribute: false})
    menuExpanded: Boolean = false;

    connectedCallback(): void {
        super.connectedCallback();
        const { basename } = this.location.params;
        this.fetchArticle(basename)
        this.fetchBlog()
    }

    async fetchBlog() {
        // TODO: handle errors 
        const blog = await fetchBlogService()
        if(!blog) {
            Router.go('/not-found')
        }
        this.blog = blog;
    }

    async fetchArticle(basename: string) {
        // we are creating a new article 
        if (!basename) {
            this.article = DefaultArticle
            return;
        }
        // TODO: handle errors 
        const articles = await fetchArticles();
        const article = articles.find((a) => a.id === basename)
        if (!article) {
            Router.go('/not-found')
            return;
        }
        this.article = article;
    }

    onDeleteArticle(e: DeleteArticleEvent) {
        if(e.detail.id === this.article?.id) {
            Router.go('/')
        }
    }

    onMenuExpand() {
        this.menuExpanded = !this.menuExpanded
    }

    render() {
        return html`
            <side-menu .expanded=${this.menuExpanded} .blog=${this.blog} @delete-article=${this.onDeleteArticle}></side-menu>
            <div>
                <button @click=${this.onMenuExpand}>
                    ${
                        this.menuExpanded ? "←" : "→"
                    }
                </button>
                ${
                    this.article ? html`<article-form .article=${this.article}></article-form>` : 'Chargement...'
                }
            </div>
        `
    }
}