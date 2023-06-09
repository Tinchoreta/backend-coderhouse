import { Router } from "express";
import { cartMiddleware } from "../../src/middlewares/cartMiddleware.js";
import CartViewController from "../../src/controllers/CartViewController.js";

const productSummaryRouter = Router();

productSummaryRouter.get("/", cartMiddleware, async (req, res, next) => {
  try {
    //TODO: Change this hard-coded cartID 
    const cartViewController = new CartViewController();
    cartViewController.renderCart(req, res, '64765d546145585e447a0436');
  } catch (error) {
    next(error);
  }
});

export default productSummaryRouter;
