import { Router } from "express"
import authRouter from "./auth.js"
import productsRouter from "./products.router.js"
import cartsRouter from "./carts.router.js"

const router = Router()

router.use('/auth', authRouter)
router.use('/products', productsRouter)
router.use('/carts', cartsRouter)


export default router;