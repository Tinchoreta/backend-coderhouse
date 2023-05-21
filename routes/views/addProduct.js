import { Router } from "express";
import ProductViewController from "../../src/controllers/ProductViewController.js";

const addProductRouter = Router();

addProductRouter.get("/", async (req, res, next) => {
  try {
    const productViewController = new ProductViewController();
    productViewController.renderAddProductForm(req, res);
  } catch (error) {
    next(error);
  }
});


export default addProductRouter;