import { Router } from "express"
const loginRouter = Router();


loginRouter.get('/', async (req, res, next) => {
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

export default loginRouter;