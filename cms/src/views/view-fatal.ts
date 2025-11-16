import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Styles } from "../styles";

@customElement('view-fatal')
export default class ViewFatal extends LitElement {

    private location: any;

    private errorMessage: string | undefined;

    static styles =
        css`
            ${Styles}

            :host {
                font-family: var(--font-primary);
            }
        `

    connectedCallback(): void {
        super.connectedCallback()
        const { error } = this.location.params;
        this.errorMessage = error || undefined;
    }

    restart() {
        window.location.href = "/"
    }

    render() {
        return html`
            <h1>
                Une erreur irrécupérable est survenue...
            </h1>
            <div>
                ${this.errorMessage}
            </div>
            <button @click=${this.restart}>Relancer</button>
        `
    }
}