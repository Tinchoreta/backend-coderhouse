import { Router } from "express";
import ProductManagerController from "../../src/controllers/ProductManagerController.js";
import DataBaseProductAdapter from "../../src/Business/DataBaseProductAdapter.js";
import {
  validateProductExistence,
  validateProductFields,
} from "../../middlewares/productMiddlewares.js";


const router = Router();

console.log(process.env.MONGODB_URI);

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
  process.env.MONGODB_URI
);

const productController = new ProductManagerController(dataBaseProductAdapter);

router.get("/", (req, res) => productController.getProducts(req, res));

router.get(
  "/:id",
  (req, res, next) => validateProductExistence(req, res, next),
  (req, res) => productController.getProductById(req, res)
);

router.post(
  "/",
(req, res, next) => validateProductFields(req, res, next),
(req, res) => productController.addProduct(req, res));


router.put("/:id",
  (req, res, next) => validateProductExistence(req, res, next),
  (req, res) => productController.updateProductItem(req, res));

router.delete("/:id",
  (req, res, next) => validateProductExistence(req, res, next),
  (req, res) => productController.removeProductItem(req, res)
);

export default router;


