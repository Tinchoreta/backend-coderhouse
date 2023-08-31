import { auth } from '../auth/auth.js';
import HTTP_STATUS_CODES from '../../utils/httpStatusCodes.js';
import ROLES from '../../utils/userRoles.js';

const {
    HTTP_UNAUTHORIZED,
    HTTP_FORBIDDEN,
    HTTP_BAD_REQUEST,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR
} = HTTP_STATUS_CODES;


const HTTP_ERRORS = {
    [HTTP_UNAUTHORIZED]: { status: 'error', error: 'Unauthorized' },
    [HTTP_FORBIDDEN]: { status: 'error', error: 'No authorization' },
    [HTTP_BAD_REQUEST]: { status: 'error', error: 'Bad request' },
    [HTTP_NOT_FOUND]: { status: 'error', error: 'Not found' },
    [HTTP_INTERNAL_SERVER_ERROR]: { status: 'error', error: 'Internal server error' },
};

class AuthorizationHandler {
    static handlePolicies(policies) {
        return (req, res, next) => {
            if (policies.includes(ROLES.PUBLIC)) return next();

            // Llama al middleware 'auth' para verificar el token JWT y establecer 'req.user'
            auth(req, res, (error) => {
                if (error) {
                    if (error.status === HTTP_STATUS_CODES.HTTP_UNAUTHORIZED) {
                        return res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORIZED).json(HTTP_ERRORS[HTTP_UNAUTHORIZED]);
                    }
                    if (error.status === HTTP_STATUS_CODES.HTTP_FORBIDDEN) {
                        return res.status(HTTP_STATUS_CODES.HTTP_FORBIDDEN).json(HTTP_ERRORS[HTTP_FORBIDDEN]);
                    }
                    if (error.status === HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR) {
                        return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json(HTTP_ERRORS[HTTP_INTERNAL_SERVER_ERROR]);
                    }
                    // Otro manejo de errores si es necesario
                }

                // Verifica las políticas de autorización
                if (!policies.includes(req.user.role.toUpperCase())) {
                    return res.status(HTTP_STATUS_CODES.HTTP_FORBIDDEN).json(HTTP_ERRORS[HTTP_FORBIDDEN]);
                }

                // Si pasa todas las verificaciones, procede con la siguiente función de middleware
                next();
            });
        };
    }
}

export default AuthorizationHandler;