import { Router } from "express";
import ProductManagerController from "../../src/controllers/ProductManagerController.js";
import TextFileProductAdapter from "../../src/Business/TextFileProductAdapter.js";
import {
  validateProductExistence,
  validateProductFields,
} from "../../middlewares/productMiddlewares.js";
import ProductViewController from "../../src/controllers/ProductViewController.js";



const router = Router();

const textFileProductAdapter = TextFileProductAdapter.getInstance(
  "./data/products.json"
);

const productController = new ProductManagerController(textFileProductAdapter);

router.get("/", (req, res) => productController.getProducts(req, res));

router.get(
  "/:id",
  (req, res, next) => validateProductExistence(req, res, next),
  (req, res) => productController.getProductById(req, res)
);

router.post(
  "/",
  (req, res, next) => validateProductFields(req, res, next),

  async (req, res) => {
    try {
      // Lógica para agregar el producto exitosamente
      (req, res) => productController.addProduct(req, res);

      // Llamar al método renderAddProductResponse del ProductViewController
      const productViewController = new ProductViewController();
      productViewController.renderAddProductResponse(req, res, true, "Producto agregado exitosamente");
    } catch (error) {
      // Manejo del error al agregar el producto

      // Llamar al método renderAddProductResponse del ProductViewController
      const productViewController = new ProductViewController();
      productViewController.renderAddProductResponse(req, res, false, "Error al agregar el producto");
    }
  }
  
);

router.put("/:id",
  (req, res, next) => validateProductExistence(req, res, next),
  (req, res) => productController.updateProductItem(req, res));

router.delete("/:id",
  (req, res, next) => validateProductExistence(req, res, next),
  (req, res) => productController.removeProductItem(req, res)
);

export default router;


