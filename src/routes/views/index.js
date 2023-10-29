import { Router } from "express"
import chatRouter from './chat.js'
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import addProductRouter from "./addProduct.js"
import productDetailsRouter from "./productDetails.js";
import productSummaryRouter from "./cart.js";
import cartCheckoutRouter from "./cartCheckout.js";
import forgetPassRouter from "./forgetPassword.js";
import resetPassRouter from "./resetPassword.js";
import CartViewController from "../../controllers/CartViewController.js";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartManagerController from "../../controllers/CartManagerController.js";

const viewRouter = Router();

viewRouter.get('/',cartMiddleware, async (req, res, next) => {
    
        const cartViewController = new CartViewController();
        const cartId = req.cartId || req.query?.cartId;
        cartViewController.renderIndex(req, res,cartId);
})

viewRouter.use('/login', authRouter);
viewRouter.use('/chat', chatRouter);
viewRouter.use('/new_product', addProductRouter);
viewRouter.use("/products", productsRouter);
viewRouter.use("/product_details", productDetailsRouter);
viewRouter.use("/product_summary", productSummaryRouter); //Cart
viewRouter.use("/product_summary/checkout", cartCheckoutRouter); //Cart checkout
viewRouter.use('/forgot-password', forgetPassRouter); 
viewRouter.use('/reset-password', resetPassRouter); 

export default viewRouter;