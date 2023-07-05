import { Router } from "express"
const authRouter = Router();


authRouter.get('/', async (req, res, next) => {
    try {
        return res.render('login', {
            title: 'login',
            script: 'login.js',
            css: 'login.css'
        });
    } catch (error) {
        next(error);
    }
})

authRouter.get('/register', async (req, res, next) => {
    try {
        return res.render('registerUser', {
            title: 'registerUser',
            script: 'registerUser.js',
            css: 'registerUser.css'
        });
    } catch (error) {
        next(error);
    }
})


export default authRouter;