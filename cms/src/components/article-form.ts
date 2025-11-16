import { html, css, type PropertyValues } from "lit";
import { property, customElement } from "lit/decorators.js";

import './html-editor'
import './meta-data'
import { DefaultArticle, type Article } from "../types";
import { saveArticle } from "../services/articles";
import { Router } from "@vaadin/router";
import { saveRessource } from "../services/ressources";
import { Styles } from "../styles";
import { AppError, declareError, LitElementWithErrorHandling } from "../utils/error";
import { UPLOAD_IMAGE_ERROR } from "./html-editor";


const ARTICLE_SAVE_ERROR = declareError({ fatal: false, translationKey: "Une erreur est survenue lors de la sauvegarde de votre article." })
@customElement('article-form')
export default class ArticleForm extends LitElementWithErrorHandling {

    static styles = css`
        ${Styles}
        :host {
            display: flex;
            flex-direction: column;
        }

        :host form {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-3);
            padding: var(--spacing-3);
        }

        html-editor {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
    `

    @property({ type: "Object" })
    article: Article = DefaultArticle;

    @property({ type: Boolean, attribute: false })
    draft: Boolean = DefaultArticle.draft

    @property({ type: Boolean, attribute: false })
    loading: boolean = false;

    connectedCallback() {
        super.connectedCallback()
        this.draft = this.article.draft
    }

    onEdit(e: CustomEvent) {
        const data = e.detail as FormData
        this.draft = data.get('draft') ? true : false
    }

    protected updated(_changedProperties: PropertyValues): void {
        const updatedArticle = _changedProperties.get('article')
        if (!updatedArticle) return
        this.draft = updatedArticle.draft
    }

    async onSubmit(e: SubmitEvent) {
        e.preventDefault()
        const form = this.shadowRoot?.querySelector('form')
        if (!form) return;
        this.error = undefined
        this.loading = true;

        const newlyCreated = !this.article.title
        const data = new FormData(form)

        let cover = data.get('cover') as string | undefined
        // if cover is data-url then it was changed / not uploaded already
        if (cover && !cover.startsWith('http')) {
            try {
                cover = await saveRessource(cover)
            } catch (e) {
                console.error(e)
                if (e instanceof AppError) {
                    this.error = e;
                } else {
                    this.error = new AppError(UPLOAD_IMAGE_ERROR, e as Error)
                }
            }
        }
        if (this.error) {
            this.loading = false;
            return;
        };

        const result: Article = Object.keys(this.article).reduce((acc: any, curr) => {
            const value = data.get(curr)
            if (value === null) return acc;
            acc[curr] = value
            return acc
        }, this.article)
        result.draft = data.get('draft') ? true : false
        result.cover = cover

        try {
            const after = await saveArticle(result)
            this.article = result
            if (newlyCreated && after) Router.go(`/write/${after.id}`)
        } catch (e) {
            console.error(e)
            if (e instanceof AppError) {
                this.error = e;
            } else {
                this.error = new AppError(ARTICLE_SAVE_ERROR, e as Error)
            }
        }
        this.loading = false;
    }

    cleanError() {
        this.error = undefined
    }

    render() {
        const error = super.render();
        const slottedError = error ? html`<div slot="error">${error}` : ''
        return html`
            <form @submit=${this.onSubmit} @edit=${this.onEdit}>
                <meta-data ?disabled=${this.loading} .article=${this.article}></meta-data>
                <html-editor ?disabled=${this.loading} @submit=${this.onSubmit} .article=${this.article} @cleanError=${this.cleanError}>
                    ${slottedError}
                </html-editor>
            </form>
        `
    }
}