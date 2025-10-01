import { html, LitElement} from 'lit'
import { customElement } from 'lit/decorators.js'
import {Router} from '@vaadin/router';

import './components/html-editor'
import './components/meta-data'
import './components/article-edit'
import './components/article-form'
import './components/articles-list'

const ROUTES = [
    {path: '/', component: 'articles-list'},
    {path: '/write', component: 'article-form'},
    {path: '/write/:basename', component: 'article-edit'},
    {path: '/not-foud', component: 'not-found'} // TODO: implement
]


@customElement('app-router')
export default class AppRouter extends LitElement {

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