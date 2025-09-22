import { LitElement, html, css, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Shows the blog background illustrations
 */
@customElement('blog-background')
export default class BlogBackground extends LitElement {

    static styles = css`
        svg {
            position: fixed;
            opacity: 0.7;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
    `

    render() {
        return html`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <circle cx="100%" cy="100%" r="30%" fill="var(--color-tertiary)"/>
            <rect x="0%" y="90%" width="100%" height="20%" fill="var(--color-tertiary)" />
            <rect x="0%" y="93%" width="100%" height="5" fill="var(--color-primary)" />
            <rect x="0%" y="95%" width="100%" height="5" fill="var(--color-primary)" />
            <rect x="0%" y="97%" width="100%" height="5" fill="var(--color-primary)" />
            <circle cx="100%" cy="100%" r="15%" fill="var(--color-primary)"/>
            <!-- <g transform="rotate(-30)">
                <rect x="-10%" y="13%" width="100%" height="5" fill="var(--color-secondary)" />
                <rect x="-10%" y="15%" width="100%" height="5" fill="var(--color-secondary)" />
                <rect x="-10%" y="17%" width="100%" height="5" fill="var(--color-secondary)" />
            </g> -->
        </svg>
        `
    }
}