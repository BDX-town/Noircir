import {
    css, html, LitElement
} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import pell, { type pellAction } from 'pell'
import type { HTMLArticle } from '../types'


const actions = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "heading1",
    "heading2",
    "quote",
    "olist",
    "ulist",
    "code",
    "line"
] as pellAction[]

// TODO: implement link
// TODO: implement image 

@customElement('html-editor')
export default class MdEditor extends LitElement {

    static styles = css`
        #editor {
            display: flex;
            flex-direction: column;
            min-height: 200px;
        }

        .pell-actionbar {
            padding: var(--spacing-2);
            display: flex;
            gap: var(--spacing-2);
        }

        .pell-actionbar > button {
            min-width: 30px;
        }

        .pell-content {
            flex-grow: 1;
            border: 1px solid black;
        }
    `
    @property({ type: "Object" })
    article: HTMLArticle = {
        cover: "<cover-here>",
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "<description-here>",
        draft: false,
        title: "<title-here>",
        htmlContent: "html-content-here"
    }

    onChange(value: string) {
        const event = new CustomEvent("change", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                value
            }
        })
        this.dispatchEvent(event)
    }

    firstUpdated() {
        if (!this.shadowRoot) return
        const editor = pell.init({
            element: this.shadowRoot?.getElementById('editor') as HTMLElement,
            onChange: this.onChange,
            defaultParagraphSeparator: 'p',
            styleWithCSS: false,
            actions,
        })

        editor.content.innerHTML = this.article.htmlContent
    }

    render() {
        return html`
            <div id="editor" />
        `
    }
}