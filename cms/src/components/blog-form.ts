import { css, html } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { DefautBlog, type Blog } from '../types'
import { saveBlog } from '../services/blog'
import { Styles } from '../styles'
import { AppError, declareError, LitElementWithErrorHandling } from '../utils/error'


const UNABLE_BLOG_SAVE_ERROR = declareError({ fatal: false, translationKey: "Une erreur est survenue lors de la sauvegarde des paramètres du blog" })

@customElement('blog-form')
export default class BlogForm extends LitElementWithErrorHandling {

    static styles = css`
        ${Styles}

        :host {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-3);
            align-items: flex-start;
        }

        div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.2rem;
            font-family: var(--font-secondary);
            color: var(--color-secondary);
        }

        div span::after {
            content: '';
            display: block;
            width: 100%;
            height: 2px;
            background: var(--color-primary);
            margin-top: var(--spacing-1);
        }

        input, textarea {
            display: block;
            width: 100%;
        }

        form {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: var(--spacing-3);
        }

        form > label {
            width: 100%;
        }
    `

    @property({ type: Object })
    blog: Blog = DefautBlog

    @property({ type: Boolean, reflect: true })
    expanded = false

    @property({ type: Boolean, attribute: false })
    loading: boolean = false

    async onSubmit(e: Event) {
        e.preventDefault()
        this.loading = true;
        this.error = undefined;
        const data = new FormData(e.target as HTMLFormElement)
        const result: Blog = Object.keys(this.blog).reduce((acc: any, curr) => {
            const value = data.get(curr)
            if (value === null) return acc;
            acc[curr] = value
            return acc
        }, this.blog)
        try {
            await saveBlog(result)
            this.blog = result
        }
        catch (e) {
            console.error(e);
            if (e instanceof AppError) {
                this.error = e;
            } else {
                this.error = new AppError(UNABLE_BLOG_SAVE_ERROR, e as Error)
            }
        }
        this.loading = false;
    }

    onExpanded() {
        this.expanded = !this.expanded
    }

    render() {
        if (!this.expanded) return html`<button @click=${this.onExpanded} type="button">⇐</button>`

        const error = super.render();

        return html`
            <div>
                <button @click=${this.onExpanded} type="button">⇒</button>
                <span>Blog</span>
            </div>
            <form @submit=${this.onSubmit}>
                <label>
                    Nom du blog:
                    <input name="title" required value=${this.blog.name} />
                </label>
                <label>
                    Couverture du blog:
                    <input name="cover" required value=${this.blog.cover} />
                </label>
                <label>
                    Description du blog:
                    <textarea rows=6 name="description" required>${this.blog.description}</textarea>
                </label>
                <label>
                    Handle fediverse:
                    <input name="fediverse" value=${this.blog.fediverse} />
                </label>
                <button ?aria-busy=${this.loading} ?disabled=${this.loading} type='submit'>♺ Mettre à jour</button>
                ${error}
            </form>
        `
    }
}