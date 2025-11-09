import { css } from "lit";

export const Styles = css`
    * {
        box-sizing: border-box;
    }

    button {
        background: var(--color-primary);
        padding: var(--spacing-2);
        border: 2px solid var(--color-secondary);
        border-radius: var(--spacing-2);
        box-shadow: -5px 5px 0px var(--color-secondary);
        transition: all 0.2s ease;
        font-weight: 600;
        cursor: pointer;
    }

    button:hover {
        box-shadow: -2px 2px 0px var(--color-secondary);
        transform: translateX(-3px) translateY(3px);
    }

    button.secondary, button.pell-button {
        box-shadow: -3px 3px 0px var(--color-secondary);
        background: transparent;
        transition: all 0.1s ease;
    }

    button.secondary:hover, button.pell-button:hover {
        box-shadow: -1px 1px 0px var(--color-secondary);
    }



    label:has(input), label:has(textarea) {
        font-family: var(--font-secondary);
        font-weight: 500;
    }

    label>input, label>textarea {
        margin-top: var(--spacing-1);
    }

    input, textarea, div#editor {
        padding: var(--spacing-2);
        border: 2px solid var(--color-secondary);
        border-radius: var(--spacing-2);
        background: var(--color-tertiary);
    }


`