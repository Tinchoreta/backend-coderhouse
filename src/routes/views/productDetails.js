import { Router } from "express";
import ProductViewController from "../../controllers/ProductViewController.js";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";

const productDetailsRouter = Router();

productDetailsRouter.get("/:pid", cartMiddleware, async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const cartId = req.cartManager?.carts[0]?._id; 

    const productViewController = new ProductViewController();
    productViewController.renderProductDetailsForm(req, res, cartId, productId);
  } catch (error) {
    next(error);
  }
});

export default productDetailsRouter;

