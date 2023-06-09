import { Router } from "express"
import chatRouter from './chat.js'
import loginRouter from './login.js'
import registerCustomerRouter from './registerCustomer.js'
import registerUserRouter from './registerUser.js'
import productsRouter from "./products.js";
import addProductRouter from "./addProduct.js"
import productDetailsRouter from "./productDetails.js";
import productSummaryRouter from "./cart.js";
import CartViewController from "../../src/controllers/CartViewController.js";
import { cartMiddleware } from "../../src/middlewares/cartMiddleware.js";

const viewRouter = Router();

viewRouter.get('/', cartMiddleware, async (req, res, next) => {
    try {
        const cartViewController = new CartViewController();
        cartViewController.renderIndex(req, res,);

    } catch (error) {
        next(error);
    }
})

viewRouter.use('/chat', chatRouter);
viewRouter.use('/new_product', addProductRouter);
viewRouter.use("/products", productsRouter);
viewRouter.use("/product_details", productDetailsRouter);
viewRouter.use("/product_summary", productSummaryRouter); //Cart
viewRouter.use('/login', loginRouter);
viewRouter.use('/register_customer', registerCustomerRouter);
viewRouter.use('/register_user', registerUserRouter);
export default viewRouter;