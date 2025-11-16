import {
    css, html
} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import pell, { type pellAction, exec } from 'pell'
import { DefaultArticle, type Article } from '../types'
import { selectFile } from '../utils/selectFile'
import { AppError, declareError, LitElementWithErrorHandling } from '../utils/error'
import { Styles } from '../styles'


export const UPLOAD_IMAGE_ERROR = declareError({ translationKey: "Une erreur est survenue lors du chargement de votre image", fatal: false })
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

        #errors {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            font-family: var(--font-secondary);
            color: var(--color-tertiary);
            font-size: 1.1rem;
            cursur: pointer;
        }

        #errors ::slotted(*), #errors>* {
            background: var(--color-error);
            padding: var(--spacing-1);
            padding-top: var(--spacing-2);
            padding-bottom: var(--spacing-2);
            border-bottom: 2px solid var(--color-secondary);
        }

        .app-error {
            padding: 0;
            color: inherit;
            text-align: left;
        }
 
        div#editor {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            min-height: 200px;
            padding: 0;
        }

        div#editor[disabled] {
            pointer-events: none;
            opacity: 0.3;
        }

        .pell-actionbar {
            padding: var(--spacing-2);
            display: flex;
            gap: var(--spacing-2);
            border-top-left-radius: var(--spacing-2);
            border-top-right-radius: var(--spacing-2);

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

    @property({ type: "Boolean"})
    disabled: Boolean = false;

    internals: ElementInternals

    observer: MutationObserver;

    errorsNode: HTMLElement | null = null;

    constructor() {
        super();
        this.internals = this.attachInternals()
        this.observer = new MutationObserver(this.onMutation);
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
        this.disabled = true;
        this.error = undefined;
        try {
            const url = await selectFile()
            exec('insertImage', url)
        } catch (e) {
            console.error(e)
            this.error = new AppError(UPLOAD_IMAGE_ERROR, e as Error)
        }
        this.disabled = false;

    }

    private submit = () => {
        const e = new CustomEvent('submit', { bubbles: true, cancelable: true, composed: true });
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

    onMutation = (mutationList: MutationRecord[]) => {
        if(!this.errorsNode) return;
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                const actions = this.shadowRoot?.querySelector('.pell-actionbar');
                if(!actions) continue;
                this.errorsNode.parentElement?.removeChild(this.errorsNode)
                actions.appendChild(this.errorsNode)
                this.errorsNode.style.top = `${actions.getBoundingClientRect().height}px`
            }
        }
    }

    watchMutations(el: HTMLElement) {
        this.observer.observe(el, { childList: true });
    }

    buildEditor(el: HTMLElement) {
        const editor = pell.init({
            element: el,
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


    firstUpdated() {
        if (!this.shadowRoot) return
        const element = this.shadowRoot?.getElementById('editor') as HTMLElement
        this.watchMutations(element);
        this.buildEditor(element);
        this.errorsNode = this.shadowRoot.getElementById('errors') as HTMLElement;
    }

    disconnectedCallback(): void {
        this.observer.disconnect();
    }

    cleanError() {
        this.error = undefined
        this.dispatchEvent(new CustomEvent('cleanError', { bubbles: true, cancelable: true, composed: true }))
    }

    render() {
        const error = super.render();
        const divError = error ? html`<div>${error}</div>` : null
        return html`
            <div id="editor" ?disabled=${this.disabled}></div>
            <div id="errors" @click=${this.cleanError}>
                ${divError}
                <slot name="error" />
            </div>
           
        `
    }
}