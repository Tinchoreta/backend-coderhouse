import { Router } from "express";
import ProductManagerController from "../../controllers/ProductManagerController.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import {
  validateProductExistence,
  validateProductFields,
  checkDuplicateProductFields,
} from "../../middlewares/business/productMiddleware.js";

import passportCall from "../../middlewares/auth/passportCall.js";

import { auth, checkUserRole } from "../../middlewares/auth/auth.js";
import passport from "passport";

import { generateOneHundredProducts } from "../../tests/productMocking.js";

import runTests from "../../tests/specs/productService.test.js";

import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import ROLES from "../../utils/userRoles.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";

const router = new CustomRouter();

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
  process.env.MONGO_DB_URI
);

const productController = new ProductManagerController(dataBaseProductAdapter);

router.get("/mockingProducts", [ROLES.ADMIN], (req, res) => {
  const products = generateOneHundredProducts();
  res.json({ 
    success: true, 
    payload: products 
  });
});

router.get('/mockingProducts/test', [ROLES.ADMIN], (req, res) => {
  try {
    const products = generateOneHundredProducts();
    // Ejecutar las pruebas
    runTests();
    res.json({ 
      success: true, 
      message: 'Tests completed successfully' 
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({ success: false, message: 'Tests failed', error: error.message });
  }
});

router.get("/", [ROLES.PUBLIC], (req, res) => productController.getProducts(req, res));

router.get("/:id", [ROLES.PUBLIC],
  validateProductExistence,
  (req, res) => productController.getProductById(req, res)
);

router.post("/", [ROLES.ADMIN],
  auth,
  checkUserRole,
  passport.authenticate('jwt',{session: false}),
  passportCall('jwt'),
  (req, res, next) => checkDuplicateProductFields(dataBaseProductAdapter, req, res, next),
  validateProductFields,

  (req, res) => productController.addProduct(req, res));


router.put("/:id", [ROLES.ADMIN],
  validateProductExistence,
  (req, res) => productController.updateProductItem(req, res));

router.delete("/:id", [ROLES.ADMIN],
  validateProductExistence,
  (req, res) => productController.removeProductItem(req, res)
);



export default router;


