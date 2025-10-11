import { LitElement, html, css, type PropertyValues } from "lit";
import { property, customElement } from "lit/decorators.js";

import './html-editor'
import './meta-data'
import { DefaultArticle, type Article } from "../types";
import { saveArticle } from "../services/articles";
import { Router } from "@vaadin/router";
import { saveRessource } from "../services/ressources";



@customElement('article-form')
export default class ArticleForm extends LitElement {

    static styles = css`
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

    connectedCallback() {
        super.connectedCallback()
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

    async onSubmit(e: SubmitEvent) {
        e.preventDefault()

        const newlyCreated = !this.article.title
        const data = new FormData(e.target as HTMLFormElement)

        let cover = data.get('cover') as string | undefined
        // if cover is data-url then it was changed / not uploaded already
        if(cover && !cover.startsWith('http')) {
            cover = await saveRessource(cover)
        }

        const result: Article = Object.keys(this.article).reduce((acc: any, curr) => {
            const value = data.get(curr)
            if(value === null) return acc;
            acc[curr] = value
            return acc
        }, this.article)
        result.draft = data.get('draft') ? true : false
        result.cover = cover

        this.article = result
        // TODO: handle error
        const after = await saveArticle(result)
        if(newlyCreated && after) Router.go(`/write/${after.id}`)
    }

    render() {
        return html`
            <form @submit=${this.onSubmit} @edit=${this.onEdit}>
                <meta-data .article=${this.article}></meta-data>
                <html-editor .article=${this.article}></html-editor>
                <button type="submit">
                    ${this.draft ? "Enregistrer le brouillon" : "Publier l'article"}
                </button>
            </form>
        `
    }
}