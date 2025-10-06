import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";


@customElement('input-image')
export default class InputImage extends LitElement {

    static styles = css`
        :host {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 120px;
            width: 120px;
            border: 1px solid grey;
        }

        img:not([src]) {
            display: none;
        }

        img {
            position: absolute; 
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        input[type=file] {
            display: none;
        }
    `

    onChange(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if(!files) return;
        const file = files[0]
        console.log(file)
        // Read the file
        const reader = new FileReader();
        reader.onload = () => {
            console.log(this.shadowRoot!.querySelector('img'))
            this.shadowRoot!.querySelector('img')!.src = reader.result as string
        };
        reader.readAsDataURL(file)
    }

    render() {
        return html`
            <label>
                <slot></slot>
                <img />
                <input @change=${this.onChange} type="file" accept="image/*" /> 
            </label>
        `
    }
}