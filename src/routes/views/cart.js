import { Router } from "express";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartViewController from "../../controllers/CartViewController.js";

const productSummaryRouter = Router();

productSummaryRouter.get("/", async (req, res, next) => {
  try {

    const cartId = req.cartId;

    const cartViewController = new CartViewController();

    if (!cartId) {
      cartViewController.renderCart(req, res, "");
    }

    cartViewController.renderCart(req, res, cartId);

  } catch (error) {
    next(error);
  }
});

export default productSummaryRouter;
