import { Router } from "express";
import CartViewController from "../../controllers/CartViewController.js";

const cartCheckoutRouter = Router();

cartCheckoutRouter.get("/", async (req, res, next) => {
    try {

        const cartId = req.cartId;

        const cartViewController = new CartViewController();

        if (!cartId) {
            cartViewController.renderCartCheckout(req, res, "");
        }

        cartViewController.renderCartCheckout(req, res, cartId);

    } catch (error) {
        next(error);
    }
});


export default cartCheckoutRouter;
