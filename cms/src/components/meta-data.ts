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
        #root {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2);
        }

        #root > formgroup {
            display: flex;
            gap: var(--spacing-2);
        }

        input, textarea {
            display: block;
        }

        textarea {
            width: 100%;
        }

        formgroup:last-of-type > label {
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
            <form id='root' @change=${this.onChange}>
                <formgroup>
                    <label>
                        Titre:
                        <input name="title" required value=${this.article.title} />
                    </label>
                    <label>
                        Couverture: 
                        <input name="cover" value=${this.article.cover} />
                    </label>
                    <label>
                        Brouillon
                        <input name="draft" type="checkbox" ?checked=${this.article.draft} />
                    </label>
                </formgroup>
                <formgroup>
                    <label>
                        Description: 
                        <textarea required name="description">${this.article.description}</textarea>
                    </label>
           
                </formgroup>
            </form>
        `
    }
}