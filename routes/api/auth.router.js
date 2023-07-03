import { Router } from "express";
import auth from '../../src/middlewares/auth.js';
import AuthController from '../../src/controllers/AuthController.js';
import UserManagerController from "../../src/controllers/UserManagerController.js";
import DataBaseUserAdapter from "../../src/Business/adapters/DataBaseUserAdapter.js";
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
(req, res) => userController.addUser(req, res));


// LOGIN
authRouter.post('/login', isPasswordValid, (req, res, next) => authController.login(req, res, next));

// PRIVATE
authRouter.get('/private', auth, (req, res) => authController.getPrivateContent(req, res));

// LOGOUT
authRouter.post('/logout', (req, res, next) => authController.logout(req, res, next));


export default authRouter;