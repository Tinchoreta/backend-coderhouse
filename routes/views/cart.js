import { Router } from "express";
import cartMiddleware from "../../middlewares/cartMiddleware.js";
import CartViewController from "../../src/controllers/CartViewController.js";

const productSummaryRouter = Router();

productSummaryRouter.get("/", cartMiddleware, async (req, res, next) => {
  try {
    const cartViewController = new CartViewController();
    cartViewController.renderCart(req, res, '64765d546145585e447a0436');
  } catch (error) {
    next(error);
  }
});

export default productSummaryRouter;
