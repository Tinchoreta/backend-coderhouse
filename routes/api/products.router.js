import { Router } from "express";
import ProductManagerController from "../../src/controllers/ProductManagerController.js";
import DataBaseProductAdapter from "../../src/Business/adapters/DataBaseProductAdapter.js";
import {
  validateProductExistence,
  validateProductFields,
  checkDuplicateProductFields,
} from "../../src/middlewares/productMiddleware.js";

import { auth, checkUserRole } from "../../src/middlewares/auth.js";

const router = Router();

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
  process.env.MONGO_DB_URI
);

const productController = new ProductManagerController(dataBaseProductAdapter);

router.get("/", (req, res) => productController.getProducts(req, res));

router.get("/:id",
  validateProductExistence,
  (req, res) => productController.getProductById(req, res)
);

router.post("/",
  auth,
  checkUserRole,
  (req, res, next) => checkDuplicateProductFields(dataBaseProductAdapter, req, res, next) ,
  validateProductFields, 

  (req, res) => productController.addProduct(req, res));


router.put("/:id",
  validateProductExistence,
  (req, res) => productController.updateProductItem(req, res));

router.delete("/:id",
  validateProductExistence,
  (req, res) => productController.removeProductItem(req, res)
);

export default router;


