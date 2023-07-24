import { Router } from "express"
import chatRouter from './chat.js'
import registerCustomerRouter from './registerCustomer.js'
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import addProductRouter from "./addProduct.js"
import productDetailsRouter from "./productDetails.js";
import productSummaryRouter from "./cart.js";
import CartViewController from "../../controllers/CartViewController.js";
import { cartMiddleware } from "../../middlewares/cartMiddleware.js";

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
viewRouter.use('/login', authRouter);
viewRouter.use('/register_customer', registerCustomerRouter);
export default viewRouter;