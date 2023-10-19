import { Router } from "express";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";
import CartViewController from "../../controllers/CartViewController.js";

const productSummaryRouter = Router();

productSummaryRouter.get("/", cartMiddleware, async (req, res, next) => {
  try {
    //TODO: Change this hard-coded cartID 
    const cartViewController = new CartViewController();
    cartViewController.renderCart(req, res, '64765d546145585e447a0437');
  } catch (error) {
    next(error);
  }
});




export default productSummaryRouter;
