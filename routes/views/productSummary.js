import { Router } from "express";
const productSummaryRouter = Router();

productSummaryRouter.get("/", async (req, res, next) => {
  try {
    return res.render("productSummary", {
      title: "Product Summary",
      script: "productSummary.js",
      css: "productSummary.css",
    });
  } catch (error) {
    next(error);
  }
});

export default productSummaryRouter;
