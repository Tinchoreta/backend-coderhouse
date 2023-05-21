import { Router } from "express";
import ProductViewController from "../../src/controllers/ProductViewController.js";

const productRouter = Router();

productRouter.get("/", async (req, res, next) => {
    try {
        const productViewController = new ProductViewController();
        productViewController.renderProductsForm(req, res);
    } catch (error) {
        next(error);
    }
});

export default productRouter;
