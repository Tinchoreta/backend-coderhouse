import { Router } from 'express';
import CartManagerController from '../../src/Business/CartManagerController.js';

import TextFileCartManagerAdapter from '../../src/Business/TextFileCartManagerAdapter.js';

const router = Router();

const textFileCartAdapter = TextFileCartManagerAdapter.getInstance("../../../data/products.json");

const cartController = new CartManagerController(textFileCartAdapter);

router.get('/', (req, res) => cartController.getCarts(req, res)
);
router.get('/:id', (req, res) => cartController.getCartById(req, res));
router.post('/', (req, res) => cartController.addCart(req, res)
);
router.put('/:id', (req, res) => cartController.updateCartItem(req, res));
router.delete('/:id', (req, res) => cartController.removeCartItem(req, res));


export default router;