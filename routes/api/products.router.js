import { Router } from "express";
import ProductManagerController from "../../src/Business/ProductManagerController.js";
import TextFileProductAdapter from "../../src/Business/TextFileProductAdapter.js";
import {
  validateProductExistence,
  validateProductFields,
} from "../../middlewares/productMiddlewares.js";

const router = Router();

const textFileProductAdapter = TextFileProductAdapter.getInstance(
  "./data/products.json"
);

const productController = new ProductManagerController(textFileProductAdapter);

router.get("/", (req, res) => productController.getProducts(req, res));

router.get(
  "/:id",  
  (req, res, next)=> validateProductExistence(req, res, next),
  (req, res) => productController.getProductById(req, res)
);

router.post(
  "/",
  (req, res, next) => validateProductFields(req, res, next),
  (req, res) => productController.addProduct(req, res)
);

router.put("/:id", (req, res) => productController.updateProductItem(req, res));

router.delete("/:id", 
(req, res, next)=> validateProductExistence(req, res, next),
(req, res) =>  productController.removeProductItem(req, res)
);

export default router;
