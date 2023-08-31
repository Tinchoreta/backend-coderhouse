import { Router } from "express";
import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import {
    auth,
    generateToken
} from '../../middlewares/auth/auth.js';
import AuthController from '../../controllers/AuthController.js';
import passport from "passport";
import {
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword,
    isPasswordValid,
    trimUserData,
} from "../../middlewares/business/userMiddleware.js";

import ROLES from "../../utils/userRoles.js";

const authController = new AuthController();

const authRouter = new CustomRouter();

// COUNTER
authRouter.get('/',
    [ROLES.PUBLIC],
    (req, res, next) => authController.getCounter(req, res, next));

//REGISTER

authRouter.post('/register',
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword,
    trimUserData,
    [ROLES.PUBLIC],
    passport.authenticate(
        'register', {
        failureRedirect: '/api/auth/fail-register'
    }
    ),
    (req, res) => res.status(201).json({
        success: true,
        message: 'User created!',
        user: req.user,
    })
)
//(req, res) => userController.addUser(req, res)); //Esto se realizará en el passportConfig register.

//FAIL REGISTER
authRouter.get('/fail-register',
    [ROLES.PUBLIC],
    (req, res) => res.status(400).json({
        success: false,
        message: 'Register failed'
    })
);

// LOGIN
authRouter.post('/signin',
    [ROLES.PUBLIC],
    passport.authenticate(
        'signin', { session: false, failureRedirect: '/api/auth/fail-signin' }),
    isPasswordValid,
    generateToken,
    (req, res, next) => {
        try {

            res.status(200).cookie('token', req.token, { maxAge: 60 * 60 * 1000 }).json({
                success: true,
                message: 'User logged in ok!',
                user: req.user,
                token: req.token
            })
        } catch (error) {
            next(error);
        }
    }
);

//FAIL SIGNIN
authRouter.get('/fail-signin',
    [ROLES.PUBLIC],
    (req, res) => {

        return res.status(400).json({
            success: false,
            message: 'Auth failed',
        });
    });

// CURRENT
authRouter.get('/current',
    [ROLES.ADMIN],
    (req, res) => authController.getPrivateContent(req, res));

// LOGOUT
authRouter.post('/logout',
    [ROLES.PUBLIC],
    passport.authenticate('jwt', { session: false }), (req, res, next) => authController.logout(req, res, next));

//GH REGISTER
authRouter.get('/github',
    [ROLES.PUBLIC],
    passport.authenticate('github', { session: false, scope: ['user:email'] }),
    (req, res) => res.status(201).json({
        success: true,
        message: 'user created!',
        user: req.user
    })
)
authRouter.get('/github/callback',
    [ROLES.PUBLIC],
    passport.authenticate('github', { session: false, failureRedirect: '/api/auth/fail-register' }),
    (req, res) => {

        return res.redirect('/')
    }
)


export default authRouter;