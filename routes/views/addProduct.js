import { Router } from "express";
import ProductViewController from "../../src/controllers/ProductViewController.js";
import auth from "../../src/middlewares/auth.js";

const addProductRouter = Router();

addProductRouter.get("/",auth, async (req, res, next) => {
  try {
    const productViewController = new ProductViewController();
    productViewController.renderAddProductForm(req, res);
  } catch (error) {
    next(error);
  }
});


export default addProductRouter;