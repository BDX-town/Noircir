import { LitElement, html, css, type PropertyValues } from "lit";
import { property, customElement } from "lit/decorators.js";

import './html-editor'
import './meta-data'
import { DefaultArticle, type Article } from "../types";
import { createArticleId, saveArticle } from "../services/articles";
import { Router } from "@vaadin/router";
import { saveRessource } from "../services/ressources";
import { AppError, declareError, LitElementWithErrorHandling } from "../utils/error";
import Store from './../utils/article-store'
import debounce from "debounce";

const SAVE_ARTICLE_ERROR = declareError({ fatal: false, translationKey: "Impossible de sauvegarder l'article"})

@customElement('article-form')
export default class ArticleForm extends LitElementWithErrorHandling {
    static styles = css`
        ${LitElementWithErrorHandling.styles}

        :host {
            display: flex;
            flex-direction: column;
        }

        :host > form {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-3);
        }

        html-editor {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
    `

    @property({ type: "Object" })
    article: Article = DefaultArticle;

    @property({ type: Boolean, attribute: false})
    draft: Boolean = DefaultArticle.draft

    private createdAt: Date | undefined;

    connectedCallback() {
        super.connectedCallback()
        this.tryToLoadBackupFromStore();
        this.createdAt = this.article.createdAt || new Date();
    }

    private async tryToLoadBackupFromStore() {
        console.log('this.article', this.article)
        const backup = await Store.getArticle(createArticleId(this.article))
        if(!backup || (!!backup.id && backup.updatedAt <= this.article.updatedAt)) return;
        this.article = backup
        console.debug('Loaded backup', this.article)
    }

    onEdit(e: CustomEvent) {
        const data = e.detail as FormData
        this.draft = data.get('draft') ? true : false
    }

    protected updated(_changedProperties: PropertyValues): void {
        const updatedArticle = _changedProperties.get('article')
        if(!updatedArticle) return
        this.draft = updatedArticle.draft
    }

    private buildArticle(data: FormData): Article | undefined {
        if(!this.createdAt) return undefined;
        const result: Article = Object.keys(this.article).reduce((acc: any, curr) => {
            const value = data.get(curr)
            if(value === null) return acc;
            acc[curr] = value
            return acc
        }, this.article)
        result.draft = data.get('draft') ? true : false
        result.cover = data.get('cover') as string | undefined
        result.createdAt = this.createdAt; 
        result.updatedAt = new Date()
        return result
    }

    onChange = debounce((e: Event) => {
        e.preventDefault()
        const data = new FormData(this.shadowRoot?.querySelector('form') as HTMLFormElement)
        const result = this.buildArticle(data);
        if(!result) return;
        Store.storeArticle(result)
    }, 500)

    async onSubmit(e: SubmitEvent) {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const newlyCreated = !this.article.title
        const result = this.buildArticle(data);
        if(!result) return;
        try {
            // if cover is data-url then it was changed / not uploaded already
            if(result.cover && !result.cover.startsWith('http')) {
                result.cover = await saveRessource(result.cover)
            }
            this.article = result
            const after = await saveArticle(result)
            Store.storeArticle(result)
            if(newlyCreated && after) Router.go(`/write/${after.id}`)
        } catch (e) {
            console.error(e)
            this.error = new AppError(SAVE_ARTICLE_ERROR, e as Error)
        }
    }

    render() {
        console.log('render', this.article)
        const error = super.render();
        return html`
            ${error}
            <form @submit=${this.onSubmit} @change=${this.onChange}>
                <meta-data .article=${this.article}></meta-data>
                <html-editor .article=${this.article}></html-editor>
                <button type="submit">
                    ${this.draft ? "Enregistrer le brouillon" : "Publier l'article"}
                </button>
            </form>
        `
    }
}