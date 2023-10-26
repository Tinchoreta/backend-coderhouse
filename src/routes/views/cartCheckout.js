import { Router } from "express";
import CartViewController from "../../controllers/CartViewController.js";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartManagerController from "../../controllers/CartManagerController.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import DataBaseCartManagerAdapter from "../../Business/adapters/DataBaseCartManagerAdapter.js";


const cartCheckoutRouter = Router();

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const dataBaseCartAdapter = DataBaseCartManagerAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const cartController = new CartManagerController(
    dataBaseCartAdapter,
    dataBaseProductAdapter
);

cartCheckoutRouter.get("/",cartMiddleware, async (req, res, next) => {
    try {
        const cartViewController = new CartViewController();        
        let userEmail = req.user ? req.user.email : null;

        // Si req.query.email está presente, lo usa en lugar de req.user.email
        if (req.query?.email) {
            userEmail = req.query.email;
        }

        if (userEmail) {
            const cart = await cartController.searchOrCreateCart(userEmail);

            if (cart) {
                const cartId = cart._id.toString();
                req.cartId = cartId;

                cartViewController.renderCartCheckout(req, res, cartId);
            } else {
                return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error creating or retrieving cart."
                });
            }

        } else {
            cartViewController.renderCartCheckout(req, res, "");
        }
    } catch (error) {
        next(error);
    }

});


export default cartCheckoutRouter;
