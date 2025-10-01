import { css, html, LitElement } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { DefautBlog, type Blog } from '../types'
import { saveBlog } from '../services/blog'

@customElement('blog-form')
export default class BlogForm extends LitElement {

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-3);
            align-items: flex-start;
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
            gap: var(--spacing-2);
        }

        form > label {
            width: 100%;
        }
    `

    @property({ type: Object })
    blog: Blog = DefautBlog

    @property({ type: Boolean, reflect: true })
    expanded = false

    async onSubmit(e: Event) {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const result: Blog = Object.keys(this.blog).reduce((acc: any, curr) => {
            const value = data.get(curr)
            if (value === null) return acc;
            acc[curr] = value
            return acc
        }, this.blog)
        this.blog = result
        // TODO: handle error
        saveBlog(result)
    }

    onExpanded() {
        this.expanded = !this.expanded
    }

    render() {
        if (!this.expanded) return html`<button @click=${this.onExpanded} type="button">&lt;&lt;</button>`


        return html`
            <button @click=${this.onExpanded} type="button">&gt;&gt;</button>
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
                <button type='submit'>Mettre à jour</button>
            </form>
        `
    }
}