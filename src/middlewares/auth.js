import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

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
    const auth = req.headers.authorization
    console.log(auth)
    if (!auth) {
        return res.status(401).json({
            success: false,
            message: 'error de autorización!'
        })
    }
    const token = auth.split(' ')[1]
    jwt.verify(
        token,
        process.env.SECRET,
        async (error, credentials) => {
            if (error) {
                return res.status(401).json({
                    success: false,
                    message: 'error de autorización!'
                })
            }
            req.user = {
                email: credentials.email,
                role: credentials.role
            };
            return next()
        }
    )
}

function generateToken(req, res, next) {
    req.token = jwt.sign(
        {
            email: req.body.email,
            role: req.user.role,
        },
        process.env.SECRET,
        { expiresIn: '1d' } //'1d' es equivalente a: 60 * 60 * 24
    );
    res.setHeader("Authorization", `Bearer ${req.token}`);
    return next()
}


function checkUserRole(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        // Si el usuario tiene el rol de administrador (role=1), pasa al siguiente middleware
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: "No tienes autorización para realizar esta acción",
        });
    }
}


export { auth, generateToken, checkUserRole };