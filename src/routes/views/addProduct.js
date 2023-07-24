import { Router } from "express";
import ProductViewController from "../../controllers/ProductViewController.js";
import { auth, checkUserRole } from "../../middlewares/auth.js";

const addProductRouter = Router();

addProductRouter.get("/",

  auth,
  checkUserRole,

  async (req, res, next) => {
    try {
      const productViewController = new ProductViewController();
      productViewController.renderAddProductForm(req, res);
    } catch (error) {
      next(error);
    }
  });


export default addProductRouter;