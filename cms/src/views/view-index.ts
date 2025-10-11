import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import '../components/article-form'
import '../components/articles-list'
import './../components/blog-form'
import { DefaultArticle, type Article, type Blog } from "../types";
import { Router } from "@vaadin/router";
import { fetchArticles } from "../services/articles";
import { fetchBlog as fetchBlogService } from "../services/blog";
import type { DeleteArticleEvent } from "../components/article-item";
import { fetchRessources } from "../services/ressources";

@customElement('view-index')
export default class ViewIndex extends LitElement {


    private location: any;

    static styles = css`
        :host {
            display: flex;
            flex-grow: 1;
            gap: var(--spacing-2);
        }

        articles-list, blog-form {
            padding: var(--spacing-2);
        }


        articles-list[expanded] {
            min-width: 400px;
        }

        blog-form[expanded] {
            min-width: 300px;
        }

        article-form {
            flex-grow: 1;
            flex-shrink: 1;
            min-width: 0;
        }
    `
    @property({ type: Object, attribute: false })
    article: Article | undefined;


    @property({ type: Object, attribute: false })
    blog: Blog | undefined;

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


    render() {
        return html`
            <articles-list @delete-article=${this.onDeleteArticle}></articles-list>
            ${
                this.article ? html`<article-form .article=${this.article}></article-form>` : 'Chargement...'
            }
            ${
                this.blog ? html`<blog-form .blog=${this.blog}></blog-form>` : "Chargement..."
            }
        `
    }
}