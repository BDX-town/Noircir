import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import './html-editor'
import './meta-data'
import { DefaultArticle, type Article } from "../types";
import { saveArticle } from "../services/articles";



@customElement('article-form')
export default class ArticleForm extends LitElement {

    static styles = css`
    
    `

    @property({ type: "Object" })
    article: Article = DefaultArticle;

    connectedCallback() {
        super.connectedCallback()
    }


    onSubmit(e: SubmitEvent) {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const result: Article = Object.keys(this.article).reduce((acc: any, curr) => {
            const value = data.get(curr)
            if(value === null) return acc;
            acc[curr] = value
            return acc
        }, this.article)
        result.draft = data.get('draft') ? true : false
        result.htmlContent = data.get('htmlContent') as string
        this.article = result
        // TODO: handle rror
        saveArticle(result)
    }

    render() {
        return html`
            <form @submit=${this.onSubmit}>
                <meta-data .article=${this.article}></meta-data>
                <html-editor .article=${this.article}></html-editor>
                <button type="submit">
                    ${this.article.draft ? "Enregistrer le brouillon" : "Publier l'article"}
                </button>
            </form>
        `
    }
}