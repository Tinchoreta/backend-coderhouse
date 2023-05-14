import { Router } from "express"
import apiRouter from './api/index.js'
import viewsRouter from './views/index.js'
import chatRouter from './views/chat.js'

const mainRouter = Router();



mainRouter.use('/api',apiRouter);
mainRouter.use('/',viewsRouter);
mainRouter.use('/chat',chatRouter);

export default mainRouter;