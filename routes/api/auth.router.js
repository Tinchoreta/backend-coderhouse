import { Router } from "express";
import {
    auth,
    generateToken,
    checkUserRole
} from '../../src/middlewares/auth.js';
import AuthController from '../../src/controllers/AuthController.js';
import UserManagerController from "../../src/controllers/UserManagerController.js";
import DataBaseUserAdapter from "../../src/Business/adapters/DataBaseUserAdapter.js";
import passport from "passport";
import {
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword,
    isPasswordValid,
} from "../../src/middlewares/userMiddleware.js";

const dataBaseUserAdapter = DataBaseUserAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const userController = new UserManagerController(dataBaseUserAdapter);
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
        passport: req.session.passport
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
        'signin', { failureRedirect: '/api/auth/fail-signin' }),
    isPasswordValid, 
    generateToken,
    (req, res, next) => {
        try {
            req.session.email = req.user.email
            req.session.role = req.user.role
            res.status(201).json({
                success: true,
                message: 'User logged!',
                passport: req.session.passport,
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
    const errors = req.flash('error');
    return res.status(400).json({
        success: false,
        message: 'Auth failed',
        errors: errors
    });
});

// PRIVATE
authRouter.get('/private', auth, (req, res) => authController.getPrivateContent(req, res));

// LOGOUT
authRouter.post('/logout', (req, res, next) => authController.logout(req, res, next));

//GH REGISTER
authRouter.get('/github',
    passport.authenticate('github', { scope: ['user:email'] }),
    (req, res) => res.status(201).json({
        success: true,
        message: 'user created!',
        passport: req.session.passport,
        user: req.user
    })
)
authRouter.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api/auth/fail-register' }),
    (req, res) => {
        req.session.user = req.user
        return res.redirect('/')
    }
)


export default authRouter;