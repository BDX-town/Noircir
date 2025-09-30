import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { parse } from 'marked'

import './html-editor'
import './meta-data'
import type { HTMLArticle, MDArticle } from "../types";

@customElement('article-form')
export default class ArticleForm extends LitElement {

    static styles = css`
    
    `

    @property({ type: "Object" })
    article: MDArticle = {
        cover: "<cover-here>",
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "<description-here>",
        draft: false,
        title: "<title-here>",
        mdContent: "md-content-here"
    }

    @property({ attribute: false })
    htmlArticle: HTMLArticle | null = null

    connectedCallback() {
        super.connectedCallback()
        this.parseMd()
    }

    async parseMd() {
       this.htmlArticle = {
            ...this.article,
            htmlContent: await parse(this.article.mdContent)
        }
    }

    onSubmit(e: SubmitEvent) {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        console.log(e.target)
        console.log(data)
    }

    render() {
        return html`
            <form @submit=${this.onSubmit}>
                <meta-data .article=${this.article}></meta-data>
                ${
                    this.htmlArticle ? 
                        html`<html-editor .article=${this.htmlArticle}></html-editor>`
                    : ''
                }
                <button type="submit">
                    ${
                        this.article.draft ? "Enregistrer le brouillon" : "Publier l'article"
                    }
                </button>
            </form>
        `
    }
}