import { Router } from "express";
import {
    auth,
    generateToken
} from '../../src/middlewares/auth.js';
import AuthController from '../../src/controllers/AuthController.js';
import passport from "passport";
import {
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword,
    isPasswordValid,
} from "../../src/middlewares/userMiddleware.js";


const authController = new AuthController();

const authRouter = Router();

// COUNTER
authRouter.get('/', (req, res, next) => authController.getCounter(req, res, next));

//REGISTER

authRouter.post('/register',
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword,
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
authRouter.get('/fail-register', (req, res) => res.status(400).json({
    success: false,
    message: 'Register failed'
})
);

// LOGIN
authRouter.post('/signin',
    passport.authenticate(
        'signin', { session: false, failureRedirect: '/api/auth/fail-signin' }),
    isPasswordValid, 
    generateToken,
    (req, res, next) => {
        try {

            res.status(200).cookie('token', req.token,{maxAge: 60*60*1000}).json({
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
authRouter.get('/fail-signin', (req, res) => {

    return res.status(400).json({
        success: false,
        message: 'Auth failed',
    });
});

// CURRENT
authRouter.get('/current', auth, (req, res) => authController.getPrivateContent(req, res));

// LOGOUT
authRouter.post('/logout', passport.authenticate('jwt', { session: false }), (req, res, next) => authController.logout(req, res, next));

//GH REGISTER
authRouter.get('/github',
    passport.authenticate('github', { session: false, scope: ['user:email'] }),
    (req, res) => res.status(201).json({
        success: true,
        message: 'user created!',
        user: req.user
    })
)
authRouter.get('/github/callback',
    passport.authenticate('github', {session:false, failureRedirect: '/api/auth/fail-register' }),
    (req, res) => {
        
        return res.redirect('/')
    }
)


export default authRouter;