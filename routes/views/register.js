import { Router } from "express"
const registerRouter = Router();


registerRouter.get('/', async (req, res, next) => {
    try {
        return res.render('register', {
            title: 'register',
            script: 'register.js',
            css: 'register.css'
        });
    } catch (error) {
        next(error);
    }
})

export default registerRouter;