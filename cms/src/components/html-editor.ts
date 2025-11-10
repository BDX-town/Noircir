import {
    css, html, LitElement
} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import pell, { type pellAction, exec } from 'pell'
import { DefaultArticle, type Article } from '../types'
import { selectFile } from '../utils/selectFile'
import { AppError, declareError, LitElementWithErrorHandling } from '../utils/error'
import { Styles } from '../styles'



// TODO: implement link


const UPLOAD_IMAGE_ERROR = declareError({ translationKey: "Une erreur est survenue lors du chargement de votre image", fatal: false })
@customElement('html-editor')
export default class MdEditor extends LitElementWithErrorHandling {
    static formAssociated = true;

    static styles = css`
        ${Styles}
        ${LitElementWithErrorHandling.styles}
        :host {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: var(--spacing-2);
        }

        div#editor {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            min-height: 200px;
            padding: 0;
        }

        .pell-actionbar {
            padding: var(--spacing-2);
            display: flex;
            gap: var(--spacing-2);
            border-top-left-radius: var(--spacing-2);
            border-top-right-radius: var(--spacing-2);
            overflow-x: auto;

            position: sticky;
            top: 0;
            background: var(--color-tertiary);
            border-bottom: 1px solid var(--color-secondary);
        }

        .pell-actionbar > button {
            min-width: 40px;
            white-space: nowrap;
        }

        .pell-actionbar > button:last-of-type {
            margin-left: auto;
        }

        .pell-content {
            flex-grow: 1;
            border-top: 0px;
            padding-left: var(--spacing-3);
            padding-right: var(--spacing-3);
            font-family: var(--font-secondary);
        }

        .pell-content img {
            max-width: 100%;
        }
    `
    @property({ type: "Object" })
    article: Article = DefaultArticle

    internals: ElementInternals

    constructor() {
        super();
        this.internals = this.attachInternals()
    }

    private onChange = (value: string) => {
        const event = new CustomEvent("change", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                value
            }
        })
        this.dispatchEvent(event)
        const data = new FormData()
        data.set('htmlContent', value)
        this.internals.setFormValue(data)
    }

    private uploadImage = async () => {
        try {
            const url = await selectFile()
            // TODO: handle loading
            exec('insertImage', url)
        } catch(e) {
            console.error(e)
            this.error = new AppError(UPLOAD_IMAGE_ERROR, e as Error)
        }

    }

    private submit = () => {
        const e = new CustomEvent('submit', { bubbles: true, cancelable: true, composed: true});
        this.dispatchEvent(e);
    }

    private actions = [
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
        "line",
        {
            name: 'image',
            result: this.uploadImage
        },
        {
            name: 'submit',
            icon: `<div> 〒 Enregistrer</div>`,
            result: this.submit,
        }
    ] as pellAction[]

    firstUpdated() {
        if (!this.shadowRoot) return
        const editor = pell.init({
            element: this.shadowRoot?.getElementById('editor') as HTMLElement,
            onChange: this.onChange,
            defaultParagraphSeparator: 'p',
            styleWithCSS: false,
            actions: this.actions,
        })

        editor.content.innerHTML = this.article.htmlContent
        const data = new FormData()
        data.set('htmlContent', this.article.htmlContent)
        this.internals.setFormValue(data)
    }

    render() {
        const error = super.render()
        return html`
            ${error}
            <div id="editor" />
        `
    }
}