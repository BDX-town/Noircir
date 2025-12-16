import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Blog } from "../types.js";

/**
 * Shows the blog description in a blog index
 */
@customElement('blog-description')
class Description extends LitElement {
    @property({ type: Object })
    blog: Blog = {
        coverUrl: "<cover-url-goes-here>",
        title: "<title-goes-here>",
        description: "<blog-description-goes-here>"
    }

    static styles = css`
        .blog-description {
            display: flex;
            align-items: center;
            gap: var(--spacing-4);
            font-size: 1.1em;
        }

        .blog-description>img {
            position: sticky;
            top: var(--spacing-3);
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 100%;
            border: 3px solid var(--color-secondary);
            box-shadow:
                    var(--color-primary) -3px -0px,
                    var(--color-primary) 0px -3px,
                    var(--color-primary) 0px 3px,
                    var(--color-primary) 3px 0px,

                    var(--color-tertiary) -8px -0px,
                    var(--color-tertiary) 0px -8px,
                    var(--color-tertiary) 0px 8px,
                    var(--color-tertiary) 8px 0px
                ;
        }

        .blog-description>p {
            margin: 0;
            padding: var(--spacing-2);
            border-radius: var(--spacing-2);
            color: var(--color-secondary);
            border: 1px dashed var(--color-primary);
            padding-left: var(--spacing-3);
            display: flex;
            flex-direction: column;
        }
    `

    render() {
        return html`
            <div class="blog-description">
                <img src=${this.blog.coverUrl} />
                <p>
                    ${this.blog.description}
                </p>
            </div>
        `
    }
}