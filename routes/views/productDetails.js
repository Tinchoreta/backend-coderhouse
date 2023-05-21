import { Router } from "express";
const productDetailsRouter = Router();

productDetailsRouter.get("/", async (req, res, next) => {
  try {
    return res.render("productDetails", {
      title: "ProductDetails",
      script: "productDetails.js",
      css: "productDetails.css",
    });
  } catch (error) {
    next(error);
  }
});

export default productDetailsRouter;
