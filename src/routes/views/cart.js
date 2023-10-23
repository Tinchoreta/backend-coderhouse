import { Router } from "express";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartViewController from "../../controllers/CartViewController.js";

const productSummaryRouter = Router();

productSummaryRouter.get("/", cartMiddleware, async (req, res, next) => {
  try {

    const cartId = req.cartManager?.cartList[0]?._id;

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
