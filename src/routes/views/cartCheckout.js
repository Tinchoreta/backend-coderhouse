import { Router } from "express";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartViewController from "../../controllers/CartViewController.js";

const cartCheckoutRouter = Router();

cartCheckoutRouter.get("/", cartMiddleware, async (req, res, next) => {
    try {

        const cartId = req.cartManager?.cartList[0]?._id;

        const cartViewController = new CartViewController();

        if (!cartId) {
            return res.status(500).send('Cart ID not found');
        }

        cartViewController.renderCartCheckout(req, res, cartId);
    } catch (error) {
        next(error);
    }
});


export default cartCheckoutRouter;
