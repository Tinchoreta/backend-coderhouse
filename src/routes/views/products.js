import { Router } from "express";
import ProductViewController from "../../controllers/ProductViewController.js";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";

const productRouter = Router();

productRouter.get("/", cartMiddleware, async (req, res, next) => {
    try {
        const productViewController = new ProductViewController();
        productViewController.renderProductsForm(req, res);
    } catch (error) {
        next(error);
    }
});

export default productRouter;
