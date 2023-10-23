import { Router } from "express";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartViewController from "../../controllers/CartViewController.js";

const productSummaryRouter = Router();

productSummaryRouter.get("/", async (req, res, next) => {
  try {

    const cartId = req.cartId;

    const cartViewController = new CartViewController();

    if (!cartId) {
      return res.status(500).send('Cart ID not found'); // Maneja la falta de un cartId
    }

    cartViewController.renderCart(req, res, cartId);

  } catch (error) {
    next(error);
  }
});

export default productSummaryRouter;
