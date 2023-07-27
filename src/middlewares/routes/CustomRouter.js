import { Router } from 'express';
import ResponseGenerator from './ResponseGenerator.js';
import AuthorizationHandler from './AuthorizationHandler.js';
import HTTP_STATUS_CODES from '../../utils/httpStatusCodes.js';

class RouterClass {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() { }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                console.error(error);
                params[1].status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send(error);
            }
        });
    }
}

class CustomRouter extends RouterClass {
    constructor() {
        super();
    }

    generateCustomResponses() {
        return (req, res, next) => {
            res.sendSuccess = payload => ResponseGenerator.generateSuccess(res, payload);
            res.sendServerError = error => ResponseGenerator.generateServerError(res, error);
            res.sendUserError = error => ResponseGenerator.generateUserError(res, error);
            next();
        };
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, AuthorizationHandler.handlePolicies(policies), this.generateCustomResponses(), ...this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, AuthorizationHandler.handlePolicies(policies), this.generateCustomResponses(), ...this.applyCallbacks(callbacks));
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, AuthorizationHandler.handlePolicies(policies), this.generateCustomResponses(), ...this.applyCallbacks(callbacks));
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, AuthorizationHandler.handlePolicies(policies), this.generateCustomResponses(), ...this.applyCallbacks(callbacks));
    }
}

export default CustomRouter;
