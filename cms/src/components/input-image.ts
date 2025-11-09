import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AppError, declareError, LitElementWithErrorHandling } from "../utils/error";
import { onInputFileChange } from "../utils/select-file";


const FILE_READ_ERROR = declareError({ fatal: false, translationKey: "Le fichier n'est pas lisible."})
@customElement('input-image')
export default class InputImage extends LitElementWithErrorHandling {
    static formAssociated = true;

    static styles = css`
        label {
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

    @property({ type: String })
    public value: string | undefined

    @property({ type: String })
    public name: string = "input-image"

    private internals: ElementInternals

    constructor() {
        super();
        this.internals = this.attachInternals()
    }

    async onChange(event: Event) {
        this.error = undefined
        try {
            const img = await onInputFileChange(event)
            const data = new FormData()
            data.set(this.name, img)
            this.internals.setFormValue(data)
            this.value = img
            this.shadowRoot?.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, composed: true }))
        } catch (e) {
            this.error = new AppError(FILE_READ_ERROR, e as Error)
        }
    }

    render() {
        const error = super.render();

        return html`
            <label>
                ${html`${error}`}
                <slot></slot>
                <img src=${this.value} />
                <input @change=${this.onChange} type="file" accept="image/*" /> 
            </label>
        `
    }
}