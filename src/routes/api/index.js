import { Router } from "express"
import authRouter from "./auth.router.js"
import cartsRouter from "./carts.router.js"
import productsRouter from "./products.router.js"
import sessionsRouter from "./sessions.router.js"
import userRouter from './users.router.js'
import mailRouter from "./mail.router.js"
import smsRouter from "./sms.router.js"
import loggerRouter from "./logger.router.js"
import resetPasswordRouter from "./resetPassword.router.js"

const router = Router()

router.use('/auth', authRouter.getRouter())
router.use('/carts', cartsRouter.getRouter())
router.use('/products', productsRouter.getRouter())
router.use('/sessions', sessionsRouter.getRouter())
router.use('/users', userRouter.getRouter())
router.use('/mail', mailRouter.getRouter())
router.use('/message', smsRouter.getRouter())
router.use('/loggerTest', loggerRouter.getRouter())
router.use('/reset-password', resetPasswordRouter.getRouter())
export default router;