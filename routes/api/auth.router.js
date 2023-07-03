import { Router } from "express";
import auth from '../../src/middlewares/auth.js';
import AuthController from '../../src/controllers/AuthController.js';
import { isPasswordValid } from '../../src/middlewares/userMiddleware.js'

const authRouter = Router();
const authController = new AuthController();

// COUNTER
authRouter.get('/', (req, res, next) => authController.getCounter(req, res, next));

// LOGIN
authRouter.post('/login', isPasswordValid, (req, res, next) => authController.login(req, res, next));

// PRIVATE
authRouter.get('/private', auth, (req, res) => authController.getPrivateContent(req, res));

// LOGOUT
authRouter.post('/logout', (req, res, next) => authController.logout(req, res, next));


export default authRouter;