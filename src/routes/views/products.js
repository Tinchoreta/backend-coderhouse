import { Router } from "express";
import ProductViewController from "../../controllers/ProductViewController.js";
import CartManagerController from "../../controllers/CartManagerController.js";
import DataBaseCartManagerAdapter from "../../Business/adapters/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";

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

const productRouter = Router();

productRouter.get("/", async (req, res, next) => {
    try {
        const cartId = await cartController.searchOrCreateCart(req, res);

        if (cartId !== null && cartId !== undefined) {
            req.cartId = cartId;

            const productViewController = new ProductViewController();
            productViewController.renderProductsForm(req, res, cartId);
        } else {
            
            return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error creating or retrieving cart."
            });
        }
    } catch (error) {
        next(error);
    }
});


export default productRouter;
