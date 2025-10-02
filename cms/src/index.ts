import { html, LitElement, css, type PropertyValues} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {Router} from '@vaadin/router';

import './views/view-index'
import './views/view-login'
import { client, init } from './services/client';

const LOGGED_ROUTES = [
    {path: '/', component: 'view-index'},
    {path: '/write', component: 'view-index'},
    {path: '/write/:basename', component: 'view-index'},
]

const NOT_LOGGED_ROUTES = [
    {path: '/', component: 'view-login'},
]

const COMMON_ROUTES = [
    {path: '/not-foud', component: 'not-found'} // TODO: implement
]


@customElement('app-router')
export default class AppRouter extends LitElement {

    static styles = css`
        :host, #outlet {
            display: flex; 
            flex-direction: column;
            flex-grow: 1;
        }
    `

    @property({ type: Object, attribute: false })
    routes: typeof COMMON_ROUTES = [...NOT_LOGGED_ROUTES, ...COMMON_ROUTES]

    router: Router | undefined;

    constructor() {
        super();
    }

    connectedCallback(): void {
        super.connectedCallback();
        init();
        this.onConnect(); // we check if the connexion from stored data worked
    }

    onConnect() {
        if(client) {
            this.routes = [...LOGGED_ROUTES, ...COMMON_ROUTES]
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        if(!this.shadowRoot) return;
        this.router = new Router(this.shadowRoot.getElementById('outlet'));
        this.updateRoutes()
    }

    protected updated(_changedProperties: PropertyValues): void {
        if(!_changedProperties.has('routes')) return;
        this.updateRoutes()
    }

    private updateRoutes() {
        if(!this.router) return;
        this.router.setRoutes(this.routes);
    }

    render() {
        return html`
            <div @connect=${this.onConnect} id="outlet" />
        `
    }

}