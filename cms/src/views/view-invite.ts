import { html, css } from "lit";
import { AppError, declareError, LitElementWithErrorHandling } from "../utils/error";
import { customElement } from "lit/decorators.js";
import { changePassword, connect as clientConnect, disconnect } from "../services/client";
import { Router } from "@vaadin/router";


const INVALID_TOKEN_ERROR = declareError({ fatal: false, translationKey: "Le token reçu est invalide" })
const PASSWORD_NOT_MATCH_ERROR = declareError({ fatal: false, translationKey: "Le mot de passe et sa confirmation ne correspondent pas"})
@customElement('view-invite')
export default class ViewInvite extends LitElementWithErrorHandling {

    private location: any;

    static styles = css`
        ${LitElementWithErrorHandling.styles}

        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-3);
            justify-content: center;
            flex-grow: 1;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-3);
        }

        input {
            display: block;
            width: 100%;
        }
    `

    connectedCallback(): void {
        super.connectedCallback()
        const { token } = this.location.params;
        this.connect(token)
    }

    async connect(token: string) {
        let raw: string[] = []
        try {
            raw = atob(token).split(":")
            if(raw.length < 2) {
                throw new Error("token does not follow username:password format");
            }
        } catch (e) {
            console.error(e)
            this.error = new AppError(INVALID_TOKEN_ERROR, e as Error)
        }
        const username = raw.shift() as string
        const password = raw.join(':')
        try {
            await clientConnect(username, password);
        } catch (e) {
            console.error(e)
            this.error = e as AppError;
        }
    }

    async onSubmit(e: Event) {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const data = new FormData(form)
        
        if(data.get('password') !== data.get('confirm')) {
            this.error = new AppError(PASSWORD_NOT_MATCH_ERROR)
            return;
        }

        try {
            await changePassword(data.get('password') as string)
        } catch(e) {
            console.error(e);
            this.error = e as AppError;
            return;
        }

        disconnect()
        Router.go('/')
    }

    render() {
        const error = super.render();
        return html`
            ${error}
            <form @submit=${this.onSubmit}>
                <label>
                    Nouveau mot de passe:
                    <input type="password" name="password" required minlength="12" />
                </label>
                <label>
                    Confirmation du nouveau mot de passe:
                    <input type="password" name="confirm" required />
                </label>
                <button type="submit">Changer le mot de passe</button>
            </form>
        `
    }
}