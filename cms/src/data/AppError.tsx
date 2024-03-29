import { hashCode } from "../helpers/hashCode";

const ERRORS: string[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).ERRORS = ERRORS;

export function declareError(userMessage: string) {
    const index = ERRORS.length;
    ERRORS.push(userMessage);
    return index;
}

export class AppError extends Error {
    public code: number;
    public userMessage: string;
    public userCode: string;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
        this.userMessage = ERRORS[code];
        this.userCode = hashCode(`${this.code}`);
    }
}