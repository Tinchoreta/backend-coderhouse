import { Router } from 'express';
import CartManagerController from '../../src/Business/CartManagerController.js';
import TextFileCartManagerAdapter from '../../src/Business/TextFileCartManagerAdapter.js';
import ProductManagerController from '../../src/Business/ProductManagerController.js';
import TextFileProductAdapter from '../../src/Business/TextFileProductAdapter.js';

const textFileProductAdapter = TextFileProductAdapter.getInstance("./data/products.json");
const productController = new ProductManagerController(textFileProductAdapter);
const textFileCartAdapter = TextFileCartManagerAdapter.getInstance("./data/carts.json");
const cartController = new CartManagerController(textFileCartAdapter,productController);

const router = Router();

router.get('/', (req, res) => cartController.getCarts(req, res)
);
router.get('/:id', (req, res) => cartController.getCartById(req, res));
router.post('/', (req, res) => cartController.addCart(req, res)
);
router.put('/:cid/product/:pid/:units', (req, res) => cartController.addProductToCart(req, res, productController));
router.delete('/:cid/product/:pid/:units', (req, res) => cartController.removeProductFromCart(req, res, productController));


export default router;