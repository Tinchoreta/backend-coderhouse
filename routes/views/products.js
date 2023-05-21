import { Router } from "express";
const productsRouter = Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    return res.render("products", {
      title: "Products",
      script: "products.js",
      css: "products.css",
    });
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
