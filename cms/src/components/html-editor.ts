import {
    css, html, LitElement
} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import pell, { type pellAction, exec } from 'pell'
import { DefaultArticle, type Article } from '../types'
import { selectFile } from '../utils/select-file'
import { AppError, declareError, LitElementWithErrorHandling } from '../utils/error'



// TODO: implement link


const UPLOAD_IMAGE_ERROR = declareError({ translationKey: "Une erreur est survenue lors du chargement de votre image", fatal: false })
@customElement('html-editor')
export default class MdEditor extends LitElementWithErrorHandling {
    static formAssociated = true;

    static styles = css`
        ${LitElementWithErrorHandling.styles}
        :host {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: var(--spacing-2);
        }

        #editor {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            min-height: 200px;
        }

        .pell-actionbar {
            padding: var(--spacing-2);
            display: flex;
            gap: var(--spacing-2);

            position: sticky;
            top: 0;
            background: white;
            border: 1px solid gray;
        }

        .pell-actionbar > button {
            min-width: 30px;
        }

        .pell-content {
            flex-grow: 1;
            border: 1px solid grey;
            border-top: 0px;
            padding-left: var(--spacing-3);
            padding-right: var(--spacing-3);
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