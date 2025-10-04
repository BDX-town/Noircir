import { css, html, LitElement, type CSSResultGroup } from "lit";
import { property } from "lit/decorators.js";

export type ErrorDefinition = {
    id: any,
    translationKey: string,
    fatal: boolean
}

let id = -1;
export function declareError(e: Omit<ErrorDefinition, "id">): ErrorDefinition {
    id++
    return { 
        ...e,
        id
    }
}

export class AppError extends Error implements ErrorDefinition {

    id: any;
    fatal: boolean;
    translationKey: string;

    constructor(definition: ErrorDefinition, options?: any) {
        super(definition.translationKey, options) // TODO: handle translation
        this.id = definition.id
        this.fatal = definition.fatal
        this.translationKey = definition.translationKey
    }
}

export class LitElementWithErrorHandling extends LitElement {
    @property({ type: Object })
    protected error: AppError | undefined

    static styles = css`
        .app-error {
            border: 1px solid red;
            border-radius: var(--spacing-1);
            padding: var(--spacing-1);
        }
    `

    render() {
        if(!this.error) return ''
        return html`
            <div class="app-error">
                ${this.error.message}
            </div>
        `
    }

}