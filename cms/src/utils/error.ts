import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { Styles } from "../styles";

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
    details?: Error;

    constructor(definition: ErrorDefinition, details?: Error, options?: any) {
        super(definition.translationKey, options) // TODO: handle translation
        this.id = definition.id
        this.fatal = definition.fatal
        this.translationKey = definition.translationKey
        this.details = details
    }
}

export class LitElementWithErrorHandling extends LitElement {
    @property({ type: Object })
    protected error: AppError | undefined;

    static styles = css`
        ${Styles}
        .app-error {
            padding: var(--spacing-1);
            font-family: var(--font-secondary);
            color: var(--color-error);
            text-align: right;
            line-height: 1.3;
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