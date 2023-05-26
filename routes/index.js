import { Router } from "express"
import apiRouter from './api/index.js'
import viewsRouter from './views/index.js'


const mainRouter = Router();



mainRouter.use('/api', apiRouter);
mainRouter.use('/', viewsRouter);


export default mainRouter;