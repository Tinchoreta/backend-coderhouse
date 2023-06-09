import { Router } from "express";
import ProductViewController from "../../src/controllers/ProductViewController.js";
import cartMiddleware from "../../middlewares/cartMiddleware.js";

const productRouter = Router();

productRouter.get("/",cartMiddleware,async (req, res, next) => {
    try {
        const productViewController = new ProductViewController();
        productViewController.renderProductsForm(req, res);
    } catch (error) {
        next(error);
    }
});

export default productRouter;
