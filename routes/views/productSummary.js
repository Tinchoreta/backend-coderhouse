import { Router } from "express";
import cartMiddleware from "../../middlewares/cartMiddleware.js";
import ProductViewController from "../../src/controllers/ProductViewController.js";

const productSummaryRouter = Router();

productSummaryRouter.get("/", cartMiddleware, async (req, res, next) => {
  try {
    const productViewController = new ProductViewController();
    productViewController.renderProductSummary(req, res);
  } catch (error) {
    next(error);
  }
});

export default productSummaryRouter;
