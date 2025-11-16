import { css } from "lit";

export const Styles = css`
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }


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
        position: relative;
    }

    button:hover {
        box-shadow: -2px 2px 0px var(--color-secondary);
        transform: translateX(-3px) translateY(3px);
    }

    button[disabled] {
        box-shadow: -2px 2px 0px var(--color-secondary);
        opacity: 0.8;
    }

    button[aria-busy] {
        color: transparent
    }

    button[aria-busy]::after {
        content: "↻";
        animation: 1s linear infinite running rotate;
        position: absolute;
        top: 0;
        left: 0;
        color: var(--color-secondary);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 1.2rem;
        padding-right: 1.5px;
    }

    .loader {
        animation: 1s linear infinite running rotate;
        font-size: 1.2rem;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding-right: 1.5px;
    }

    button.error {
        background: red;
    }

    button.secondary, button.pell-button:not(:last-of-type) {
        box-shadow: -3px 3px 0px var(--color-secondary);
        background: transparent;
        transition: all 0.1s ease;
    }

    button.secondary:hover, button.pell-button:hover:not(:last-of-type) {
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