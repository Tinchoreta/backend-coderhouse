import { Router } from "express";
import ProductViewController from "../../controllers/ProductViewController.js";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";

const productRouter = Router();

productRouter.get("/", cartMiddleware, async (req, res, next) => {
    try {

        const cartId = req.cartManager?.cartList[0]?._id;
        const cartIdString = cartId ? cartId.toString() : null;

        console.log(cartIdString); 
        const productViewController = new ProductViewController();
        productViewController.renderProductsForm(req, res, cartIdString);
    } catch (error) {
        next(error);
    }
});

export default productRouter;
