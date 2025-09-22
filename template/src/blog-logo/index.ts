import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Shows the blog logo
 */
@customElement('blog-logo')
class Logo extends LitElement {

    static styles = css`
        .blog-logo {
            position: relative;
            display: inline-block;
            cursor: pointer;
            font-family: var(--font-secondary);
            letter-spacing: 0.7rem;
            text-transform: uppercase;
            font-weight: 800;
            font-size: 3.5em;
            color: white;
            --modifier: 1;
            transition: filter 0.2s ease, color 0.2s ease;
            filter:
                drop-shadow(calc(0px * var(--modifier)) calc(0px * var(--modifier)) 1px hsla(var(--color-secondary-h), var(--color-secondary-s), var(--color-secondary-l), 1)) 
                drop-shadow(calc(5px * var(--modifier)) calc(5px * var(--modifier)) 0 hsla(var(--color-secondary-h), var(--color-secondary-s), var(--color-secondary-l), 1))
                drop-shadow(calc(4px * var(--modifier)) calc(4px * var(--modifier)) 0 hsla(var(--color-primary-h), var(--color-primary-s), var(--color-primary-l), 1))
                drop-shadow(calc(3px * var(--modifier)) calc(4px * var(--modifier)) 0 hsla(var(--color-tertiary-h), var(--color-tertiary-s), var(--color-tertiary-l), 1));
        }

        .blog-logo:hover {
            --modifier: 0.7;
        }

        .blog-logo>a {
            color: inherit;
            text-decoration: none;
        }
    `

    render() {
        return html`
            <div class="blog-logo">
                <a href="../..">
                    <slot />
                </a>
            </div>
        `
    }
}