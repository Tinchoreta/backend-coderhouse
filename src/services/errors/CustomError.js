import EnumeratedErrors from "./EnumeratedErrors.js";

class CustomError extends Error {
    constructor({ name, cause, code }) {
        
        super();
        const errorInfo = this.getErrorInfo(name);
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