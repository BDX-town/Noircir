import { html, LitElement, css} from 'lit'
import { customElement } from 'lit/decorators.js'
import {Router} from '@vaadin/router';

import './components/html-editor'
import './components/meta-data'
import './components/article-form'
import './components/articles-list'
import './views/view-index'

const ROUTES = [
    {path: '/', component: 'view-index'},
    {path: '/write', component: 'view-index'},
    {path: '/write/:basename', component: 'view-index'},
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


    constructor() {
        super();
    }

    protected firstUpdated(): void {
        if(!this.shadowRoot) return;
        const router = new Router(this.shadowRoot.getElementById('outlet'));
        router.setRoutes(ROUTES);
    }

    render() {
        return html`
            <div id="outlet" />
        `
    }

}