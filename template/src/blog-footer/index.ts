import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

/**
 * Shows the blog footer 
 */
@customElement('blog-footer')
export default class BlogFooter extends LitElement {
    static styles = css`
        footer {
            text-align: center;
        }
    `

    render() {
        return html`
            <footer>
                Ce blog est propulsé par <a href="https://github.com/BDX-town/Noircir" target="_blank">Noircir</a>, un système de blogging simple et léger 🍃
            </footer>
        `
    }
}