import { Router } from "express"
import authRouter from "./auth.router.js"
import cartsRouter from "./carts.router.js"
import productsRouter from "./products.router.js"
import sessionsRouter from "./sessions.router.js"
import userRouter from './users.router.js'
import mailRouter from "./mail.router.js"
import smsRouter from "./sms.router.js"
import loggerRouter from "./logger.router.js"

const router = Router()

router.use('/auth', authRouter.getRouter())
router.use('/carts', cartsRouter.getRouter())
router.use('/products', productsRouter.getRouter())
router.use('/sessions', sessionsRouter)
router.use('/users', userRouter)
router.use('/mail', mailRouter.getRouter())
router.use('/message', smsRouter.getRouter())
router.use('/loggerTest', loggerRouter.getRouter())

export default router;