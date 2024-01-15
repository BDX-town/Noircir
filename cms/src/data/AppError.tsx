import ErrorStackParser from "error-stack-parser";
import { hashCode } from "../helpers/hashCode";

export class AppError extends Error {
    public code: string;
    public userMessage: string;
    public isExpected: boolean;

    constructor(error: Error, userMessage: string | undefined, isExpected: boolean | undefined) {
        super(error.message);
        Object.assign(this, error);
        this.userMessage = userMessage || error.message;
        this.isExpected = isExpected || false;

        const trace = ErrorStackParser.parse(error);
        if(trace.length === 0) throw new Error("Invalid trace");
        this.code = hashCode(`${trace[0].fileName}-${trace[0].lineNumber}`);
    }
}