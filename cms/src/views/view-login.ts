import { LitElement, html, css  } from "lit";
import { customElement } from "lit/decorators.js";
import { connect } from "../services/client";

@customElement('view-login')
export default class ViewLogin extends LitElement {

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;
            align-items: center;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-3);
        }

        input {
            display: block;
        }
    `

    static ConnectEvent = new CustomEvent('connect', { bubbles: true, cancelable: true, composed: true })

    onSubmit(e: Event) {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement)
        connect(data.get('username') as string, data.get('password') as string)
        e.currentTarget?.dispatchEvent(ViewLogin.ConnectEvent)
    }


    render() {
        return html`
            <form @submit=${this.onSubmit}>
                <label>
                    Nom d'utilisateur:
                    <input name="username" required />
                </label>
                <label>
                    Mot de passe:
                    <input name="password" type="password" required />
                </label>
                <button type="submit">Connexion</button>
            </form>
        `
    }
}