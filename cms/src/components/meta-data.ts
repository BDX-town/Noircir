import { html, css, LitElement } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { DefaultArticle, type Article } from '../types'

import './input-image'
import { Styles } from '../styles';

@customElement('meta-data')
export default class MetaData extends LitElement {
    static formAssociated = true;
    static styles? = css`
        ${Styles}

        * {
            box-sizing: border-box;
        }

        form {
            display: flex;
            gap: var(--spacing-2);
        }

        form > div {
            flex-grow: 1;
            display: flex; 
            flex-direction: column;
            gap: var(--spacing-3);
        }

        form > div > label {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        fieldset {
            display: flex;
            gap: var(--spacing-2);
            border: 0;
            padding: 0;
        }

        fieldset > label {
            flex-grow: 1;
            display: block;
        }

        fieldset > label.checkbox {
            flex-grow: 0;
        }

        input, textarea {
            display: block;
        }

        textarea {
            flex-grow: 1;
        }

        input:not([type=checkbox]), textarea {
            width: 100%;
        }
    `

    @property({ type: "Object" })
    article: Article = DefaultArticle

    private internals: ElementInternals;

    constructor() {
        super();
        this.internals = this.attachInternals();
    }

    protected firstUpdated(): void {
        const root = this.shadowRoot?.querySelector('form');
        const data = new FormData(root as HTMLFormElement)
        this.internals.setFormValue(data)
    }

    private onChange(e: Event): void {
        const data = new FormData(e.currentTarget as HTMLFormElement)
        this.internals.setFormValue(data)
        const event = new CustomEvent('edit', { bubbles: true,cancelable: true, composed: true, detail: data })
        this.dispatchEvent(event)
    }

    render() {
        return html`
            <form @change=${this.onChange}>
                <div>
                    <fieldset>
                        <label>
                            <span>
                                Titre:
                            </span>
                            <input name="title" required value=${this.article.title} />
                        </label>
                        <label class="checkbox">
                            <span>
                                Brouillon
                            </span>
                            <input name="draft" type="checkbox" ?checked=${this.article.draft} />
                        </label>
                    </fieldset>
                    <label>
                        <span>
                            Description: 
                        </span>
                        <textarea required name="description">${this.article.description}</textarea>
                    </label>
                </div>
                <input-image name="cover" value=${this.article.cover}>Couverture</input-image>
            </form>
        `
    }
}

// <input name="cover" value=${this.article.cover} />
