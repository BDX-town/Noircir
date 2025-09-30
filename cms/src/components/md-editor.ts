import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import pell from 'pell'

@customElement('md-editor')
export default class MdEditor extends LitElement {

    connectedCallback() {
        super.connectedCallback()
        console.log('connected')

        // Initialize pell on an HTMLElement
        pell.init({
            element: document.getElementById('editor') as HTMLElement,
            onChange: (value: string) => console.log(value),
            defaultParagraphSeparator: 'p',
            styleWithCSS: false,
            actions: [
                'bold',
                {
                    name: 'custom',
                    icon: 'C',
                    title: 'Custom Action',
                    result: () => console.log('Do something!')
                },
                'underline'
            ],
            classes: {
                actionbar: 'pell-actionbar',
                button: 'pell-button',
                content: 'pell-content',
                selected: 'pell-button-selected'
            }
        })

    }

    render() {
        return html`
            <div id="editor" />
        `
    }
}