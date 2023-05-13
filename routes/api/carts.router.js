import { Router } from 'express';
import CartManagerController from '../../src/Business/CartManagerController.js';
import TextFileCartManagerAdapter from '../../src/Business/TextFileCartManagerAdapter.js';
import ProductManagerController from '../../src/Business/ProductManagerController.js';
import TextFileProductAdapter from '../../src/Business/TextFileProductAdapter.js';

const textFileProductAdapter = TextFileProductAdapter.getInstance("./data/products.json");

const textFileCartAdapter = TextFileCartManagerAdapter.getInstance("./data/carts.json");
const cartController = new CartManagerController(textFileCartAdapter, textFileProductAdapter);

const router = Router();

router.get('/', (req, res) => cartController.getCarts(req, res)
);
router.get('/:id', (req, res) => cartController.getCartById(req, res));
router.post('/', (req, res) => cartController.createCart(req, res)
);
router.put('/:cid/product/:pid/:units', (req, res) => cartController.addProductUnitsToCart(req, res));
router.delete('/:cid/product/:pid/:units', (req, res) => cartController.removeProductUnitsFromCart(req, res));


export default router;