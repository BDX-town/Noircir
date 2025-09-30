import { html, css, LitElement } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import type { Article } from '../types'

// title: "Découvertes n°1 - Les robots rêvent-ils de guitares éléctriques ?"
// description: "Les robots rêvent-ils de guitares éléctriques ?"
// cover: "https://noircir.bdx.town/blogs/clovis/ressources/1000007217.png.webp"
// createdAt: "2024-04-11T17:34:03.811Z"
// updatedAt: "2024-10-18T23:14:52.131Z"
// draft: true

@customElement('meta-data')
export default class MetaData extends LitElement {
    static shadowRootOptions = { ...LitElement.shadowRootOptions, mode: 'open' as const, formAssociated: true }
    static styles? = css`
        .root {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2);
        }

        .root > formgroup {
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
    article: Article = {
        cover: "<cover-here>",
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "<description-here>",
        draft: false,
        title: "<title-here>",
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.attachInternals()
    }



    render() {
        return html`
            <formgroup class="root">
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
            </formgroup>
        `
    }
}