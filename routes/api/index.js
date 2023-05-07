import { Router } from "express"
import authRouter from "./auth.js"
import productsRouter from "./products.router.js"
import cartsRouter from "./carts.router.js"

const router = Router()

router.use('/auth',authRouter)
router.use('/products',productsRouter)
router.use('/carts',cartsRouter)

// console.log(productsRouter.stack)
// router.stack.forEach(({ route, path, name }) => {
//     if (route) {
//       console.log(`Ruta: ${route.path}, método: ${route.stack[0].method}`);
//     } else if (path && name === 'router') {
//       console.log(`Rutas montadas por el router en: ${path}`);
//     } else {
//       console.log('Ruta no definida');
//     }
//   });

export default router;