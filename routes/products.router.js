import { Router } from 'express';
import ProductManagerController from '../backend/Business/ProductManagerController.js';

const router = Router();
const productController = new ProductManagerController();

router.get('/', productController.getProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.post('/', productController.addProduct.bind(productController));
router.put('/:id', productController.updateProductItem.bind(productController));
router.delete('/:id', productController.removeProductItem.bind(productController));

export default router;