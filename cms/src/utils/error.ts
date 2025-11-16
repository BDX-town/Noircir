import { css, html, LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { Styles } from "../styles";
import { Router } from '@vaadin/router'

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
            font-weight: 500;
            text-align: right;
            line-height: 1.3;
            color: var(--color-secondary);
            position: relative;
            display: inline;
        }

        .app-error span {
            color: var(--color-error);
            font-size: 1.3rem;
        }
    `

    protected shouldUpdate(_changedProperties: PropertyValues): boolean {
        if(_changedProperties.has('error')) {
            const newError = _changedProperties.get('error') as AppError | undefined
            if(newError && newError.fatal) {
                Router.go(`/fatal/${encodeURIComponent(newError.message)}`)
                return false;
            }
        }
        return true;
    }

    render() {
        if(!this.error) return ''
        return html`
            <div class="app-error">
                <span>ε</span> ${this.error.message}
            </div>
        `
    }
}