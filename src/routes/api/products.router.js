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

import runTests from "../../tests/productService.test.js";

const router = Router();

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
  process.env.MONGO_DB_URI
);

const productController = new ProductManagerController(dataBaseProductAdapter);

router.get("/mockingProducts", (req, res) => {
  const products = generateOneHundredProducts();
  res.json({ 
    success: true, 
    payload: products 
  });
});

router.get('/mockingProducts/test', (req, res) => {
  try {
    const products = generateOneHundredProducts();
    // Ejecutar las pruebas
    runTests();
    res.json({ 
      success: true, 
      message: 'Tests completed successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Tests failed', error: error.message });
  }
});

router.get("/", (req, res) => productController.getProducts(req, res));

router.get("/:id",
  validateProductExistence,
  (req, res) => productController.getProductById(req, res)
);

router.post("/",
  auth,
  checkUserRole,
  passport.authenticate('jwt',{session: false}),
  passportCall('jwt'),
  (req, res, next) => checkDuplicateProductFields(dataBaseProductAdapter, req, res, next),
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


