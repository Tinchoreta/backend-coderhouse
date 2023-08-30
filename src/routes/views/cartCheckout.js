import { Router } from "express";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartViewController from "../../controllers/CartViewController.js";

const cartCheckoutRouter = Router();

cartCheckoutRouter.get("/", cartMiddleware, async (req, res, next) => {
    try {
        //TODO: Change this hard-coded cartID 
        const cartViewController = new CartViewController();
        cartViewController.renderCartCheckout(req, res, '64765d546145585e447a0437');
    } catch (error) {
        next(error);
    }
});


export default cartCheckoutRouter;
