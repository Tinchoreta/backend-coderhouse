import { Router } from "express";
import ProductManagerController from "../../controllers/ProductManagerController.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import {
  validateProductExistence,
  validateProductFields,
  checkDuplicateProductFields,
} from "../../middlewares/productMiddleware.js";

import passportCall from "../../middlewares/passportCall.js";

import { auth, checkUserRole } from "../../middlewares/auth.js";
import passport from "passport";

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
  // auth,
  // checkUserRole,
  // passport.authenticate('jwt',{session: false}),
  passportCall('jwt'),
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

