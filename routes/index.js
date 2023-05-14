import { Router } from "express"
import apiRouter from './api/index.js'
import viewsRouter from './views/index.js'

const mainRouter = Router();



mainRouter.use('/api',apiRouter);
mainRouter.use('/views',viewsRouter);

mainRouter.get('/', async(req,res,next)=> {
    try {
        return res.render('index',{
            title: 'index',
            script: 'chat.js'
        });
    } catch(error) {
        next(error);
    }
})

export default mainRouter;