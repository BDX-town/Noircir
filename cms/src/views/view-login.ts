import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { connect } from "../services/client";
import { AppError, LitElementWithErrorHandling } from "../utils/error";
import { Styles } from "../styles";

@customElement('view-login')
export default class ViewLogin extends LitElementWithErrorHandling {

    static styles =
        css`
            ${Styles}
            ${LitElementWithErrorHandling.styles}

            :host {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                justify-content: center;
                align-items: center;
                gap: var(--spacing-2);
            }

            form {
                width: 350px;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-4);
            }

            label, label input {
                width: 100%;
            }

            form>img {
                width: 200px;
            }

            form>div {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-3);
            }

            input {
                display: block;
            }
        `

    static ConnectEvent = new CustomEvent('connect', { bubbles: true, cancelable: true, composed: true })

    async onSubmit(e: Event) {
        e.preventDefault();
        const { currentTarget } = e;
        const data = new FormData(currentTarget as HTMLFormElement)
        try {
            await connect(data.get('username') as string, data.get('password') as string)
            currentTarget?.dispatchEvent(ViewLogin.ConnectEvent)
        } catch (e) {
            console.error(e)
            this.error = e as AppError;
        }
    }


    render() {
        const error = super.render()
        return html`
            <form @submit=${this.onSubmit}>
                <img src="/noircir.svg" />
                <div>
                    <label>
                        Nom d'utilisateur:
                        <input name="username" required />
                    </label>
                    <label>
                        Mot de passe:
                        <input name="password" type="password" required />
                    </label>
                </div>
                <div>
                    <button type="submit">Connexion</button>
                    ${error}
                </div>
            </form>
        `
    }
}