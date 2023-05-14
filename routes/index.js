import { Router } from "express"
import apiRouter from './api/index.js'
import viewsRouter from './views/index.js'
import chatRouter from './views/chat.js'
import productRouter from "./views/product.js"

const mainRouter = Router();



mainRouter.use('/api',apiRouter);
mainRouter.use('/',viewsRouter);
mainRouter.use('/chat',chatRouter);
mainRouter.use('/new_product',productRouter);

export default mainRouter;