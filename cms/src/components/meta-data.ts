import { html, css, LitElement } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { DefaultArticle, type Article } from '../types'

// title: "Découvertes n°1 - Les robots rêvent-ils de guitares éléctriques ?"
// description: "Les robots rêvent-ils de guitares éléctriques ?"
// cover: "https://noircir.bdx.town/blogs/clovis/ressources/1000007217.png.webp"
// createdAt: "2024-04-11T17:34:03.811Z"
// updatedAt: "2024-10-18T23:14:52.131Z"
// draft: true

@customElement('meta-data')
export default class MetaData extends LitElement {
    static formAssociated = true;
    static styles? = css`
        * {
            box-sizing: border-box;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2);
        }

        form > fieldset {
            display: flex;
            gap: var(--spacing-2);
            border: 0;
            padding: 0;
        }

        form > fieldset > label {
            flex-grow: 1;
            display: block;
        }

        input, textarea {
            display: block;
        }

        input:not([type=checkbox]), textarea {
            width: 100%;
        }

        fieldset:last-of-type > label {
            flex-grow: 1;
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
        const root = this.shadowRoot?.getElementById("root");
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
                <fieldset>
                    <label>
                        <span>
                            Titre:
                        </span>
                        <input name="title" required value=${this.article.title} />
                    </label>
                    <label>
                        <span>
                            Couverture: 
                        </span>
                        <input name="cover" value=${this.article.cover} />
                    </label>
                    <label>
                        <span>
                            Brouillon
                        </span>
                        <input name="draft" type="checkbox" ?checked=${this.article.draft} />
                    </label>
                </fieldset>
                <fieldset>
                    <label>
                        <span>
                            Description: 
                        </span>
                        <textarea required name="description">${this.article.description}</textarea>
                    </label>
           
                </fieldset>
            </form>
        `
    }
}