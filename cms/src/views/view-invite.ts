import { html, css } from "lit";
import { AppError, declareError, LitElementWithErrorHandling } from "../utils/error";
import { customElement, property } from "lit/decorators.js";
import { BAD_CREDENTIALS_ERROR, changePassword, connect as clientConnect, disconnect } from "../services/client";
import { Router } from "@vaadin/router";
import { wait } from "../utils/wait";


const INVALID_TOKEN_ERROR = declareError({ fatal: false, translationKey: "Votre invitation n'est pas valide" })
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
            gap: var(--spacing-4);
            width: 350px;
        }

        form img {
            width: 200px;
        }

        input {
            display: block;
            width: 100%;
        }

        form>div {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2);
        }

        p {
            font-family: var(--font-secondary);
            opacity: 0.9;
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 0;
        }
    `

    @property({ type: Boolean, attribute: false })
    private loading: boolean = false

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
            const appError = e as AppError
            console.error(e)
            if(appError.id === BAD_CREDENTIALS_ERROR.id) {
                this.error = new AppError(INVALID_TOKEN_ERROR, e as Error)
            } else {
                this.error = e as AppError;
            }
        }
    }

    async onSubmit(e: Event) {
        this.error = undefined
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const data = new FormData(form)
        
        if(data.get('password') !== data.get('confirm')) {
            this.error = new AppError(PASSWORD_NOT_MATCH_ERROR)
            return;
        }

        this.loading = true;
        await wait(1000);
        try {
            await changePassword(data.get('password') as string)
            this.loading = false
            disconnect()
            Router.go('/')
        } catch(e) {
            this.loading = false
            console.error(e);
            this.error = e as AppError;
            return;
        }
    }

    render() {
        const error = super.render();
        return html`
            <form @submit=${this.onSubmit}>
                <img src="/noircir.svg" />
                <p>
                    Vous avez reçu une invitation au système de blog Noircir !<br />
                    Pour pouvoir utiliser le service, veuillez choisir un mot de passe.<br />
                    Une fois le mot de passe choisi, cette invitation ne sera plus valide, vous pourrez utiliser votre mot de passe pour vous <a href="/login">connecter</a>.
                </p>
                <label>
                    Nouveau mot de passe:
                    <input type="password" name="password" required minlength="12" />
                </label>
                <label>
                    Confirmation du nouveau mot de passe:
                    <input type="password" name="confirm" required />
                </label>
                <div>
                    <button type="submit" ?disabled=${this.loading} ?aria-busy=${this.loading}>Changer le mot de passe</button>
                    ${error}
                </div>
            </form>
        `
    }
}