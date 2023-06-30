import { Router } from "express"
const registerUserRouter = Router();


registerUserRouter.get('/', async (req, res, next) => {
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

export default registerUserRouter;