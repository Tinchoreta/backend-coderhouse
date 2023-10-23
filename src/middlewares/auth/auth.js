import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";
import ROLES from "../../utils/userRoles.js";
/*
{ expiresIn: '1d' } //'1d' es equivalente a: 60 * 60 * 24
'60s': El token expira en 60 segundos.
'2m': El token expira en 2 minutos.
'30m': El token expira en 30 minutos.
'1h': El token expira en 1 hora.
'2h': El token expira en 2 horas.
'12h': El token expira en 12 horas.
'1d': El token expira en 1 día.
'7d': El token expira en 7 días.
'30d': El token expira en 30 días.
'365d': El token expira en 365 días.
*/

function auth(req, res, next) {
    const auth = req.headers?.authorization;
    console.log(auth);
    if (!auth) {
        return res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORIZED).json({
            success: false,
            message: 'Error de autorización!'
        });
    }
    const token = auth.split(' ')[1];
    jwt.verify(
        token,
        config.privateKeyJwt,
        async (error, credentials) => {
            if (error) {
                return res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORIZED).json({
                    success: false,
                    message: 'Error de autorización!'
                });
            }
            req.user = {
                email: credentials.email,
                role: credentials.role
            };
            return next();
        }
    );
}

function generateToken(req, res, next) {
    req.token = jwt.sign(
        {
            email: req.body.email,
            role: req.user.role,
        },
        config.privateKeyJwt,
        { expiresIn: '1d' } //'1d' es equivalente a: 60 * 60 * 24
    );
    res.cookie('token', req.token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true });
    res.setHeader("Authorization", `Bearer ${req.token}`);
    return next();
}

function checkUserRole(req, res, next) {
    const allowedRoles = [ROLES.ADMIN, ROLES.USER, ROLES.USER_PREMIUM];

    if (req.user && allowedRoles.includes(String(req.user.role).toUpperCase())) {
        // Si el usuario tiene uno de los roles permitidos, pasa al siguiente middleware
        next();
    } else {
        return res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORIZED).json({
            success: false,
            message: "No tienes autorización para realizar esta acción (CheckUserRole)",
        });
    }
}

export { auth, generateToken, checkUserRole };
