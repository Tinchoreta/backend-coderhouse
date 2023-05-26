import { Router } from "express";
import ProductViewController from "../../src/controllers/ProductViewController.js";

const productDetailsRouter = Router();

productDetailsRouter.get("/:pid", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.pid);
    
    const productViewController = new ProductViewController();
    productViewController.renderProductDetailsForm(req, res, productId);
  } catch (error) {
    next(error);
  }
});

export default productDetailsRouter;
