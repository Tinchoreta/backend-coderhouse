import EnumeratedErrors from "./EnumeratedErrors.js";

class CustomError extends Error {
    constructor({ name, cause, code }) {
        const errorInfo = this.getErrorInfo(name);
        super(errorInfo.message);
        this.name = errorInfo.name;
        this.code = code || errorInfo.code;
        this.cause = cause;
    }

    getErrorInfo(name) {
        const defaultError = EnumeratedErrors.DATABASE_ERROR;
        const errorInfo = EnumeratedErrors[name];
        return errorInfo || defaultError;
    }
}

export default CustomError;