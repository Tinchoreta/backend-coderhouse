import User from "../models/user.model.js"
import jwt from "jsonwebtoken"


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
            let user = await User.findOne({ email: credentials.email })
            req.user = user
            return next()
        }
    )
}

function generateToken (req, res, next) {
    req.token = jwt.sign(
        { email: req.body.email },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 }
    )
    return next()
}


function checkUserRole(req, res, next) {
    if (req.user && req.user.role === 1) {
        // Si el usuario tiene el rol de administrador (role=1), pasa al siguiente middleware
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: "No tienes autorización para realizar esta acción",
        });
    }
}


export {auth, generateToken, checkUserRole};