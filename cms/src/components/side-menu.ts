import type { Blog } from "../types";
import { LitElementWithErrorHandling } from "../utils/error";
import { property, customElement } from "lit/decorators.js";

import './articles-list'
import './blog-form'
import { css, html } from "lit";
import { Styles } from "../styles";


@customElement('side-menu')
export default class SideMenu extends LitElementWithErrorHandling {


    static styles = css`
            ${Styles}
            :host {
                display: flex;
                flex-direction: column;
                padding: var(--spacing-2);
                max-width: 400px;
            }

            :host>div {
                text-align: right;
            }

            :host>hr {
                width: 100%;
                margin-top: var(--spacing-3);
                margin-bottom: var(--spacing-4);
                border: 1px var(--color-secondary) dashed;
            }

            :host article-list {
                flex-grow: 1;
                gap: var(--spacing-2);
            }
        `

    @property({ type: Object })
    blog: Blog | undefined

    @property({ type: Boolean, reflect: true })
    expanded = true

    onExpand() {
        this.expanded = !this.expanded
    }

    render() {
        if (!this.expanded) {
            return html`
                <div><button @click=${this.onExpand} type="button">⇒</button></div>
            `
        }

        return html`
            <div>
                <button @click=${this.onExpand} type="button">⇐</button>
            </div>
            ${this.blog ? html`<blog-form .blog=${this.blog}></blog-form>` : "<div aria-busy>Chargement...</div>"}
            <hr />
            <articles-list></articles-list>
        `
    }
}