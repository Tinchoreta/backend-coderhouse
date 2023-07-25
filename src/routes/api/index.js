import { Router } from "express"
import authRouter from "./auth.router.js"
import cartsRouter from "./carts.router.js"
import productsRouter from "./products.router.js"
import sessionsRouter from "./sessions.router.js"
import userRouter from './users.router.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/carts', cartsRouter)
router.use('/products', productsRouter)
router.use('/sessions', sessionsRouter)
router.use('/users', userRouter)

export default router;