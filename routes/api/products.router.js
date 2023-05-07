import { Router } from 'express';
import ProductManagerController from '../../src/Business/ProductManagerController.js';

import TextFileProductAdapter from '../../src/Business/TextFileProductAdapter.js';

const router = Router();

const textFileProductAdapter = TextFileProductAdapter.getInstance("./data/products.json");

const productController = new ProductManagerController(textFileProductAdapter);

router.get('/', (req, res) => productController.getProducts(req, res)
);
router.get('/:id', (req, res) => productController.getProductById(req, res));
router.post('/', (req, res) => productController.addProduct(req, res)
);
router.put('/:id', (req, res) => productController.updateProductItem(req, res));
router.delete('/:id', (req, res) => productController.removeProductItem(req, res));

//console.log(router.stack)

// (async () => {
//     for await (const layer of router.stack) {
//         if (layer.route) {
//             // Manejar las rutas definidas
//             console.log(`Ruta definida: ${layer.route.path}`);
//         } else if (layer.name === 'router') {
//             // Manejar subrutas definidas
//             for await (const subLayer of layer.handle.stack) {
//                 if (subLayer.route) {
//                     console.log(`Subruta definida: ${layer.path}${subLayer.route.path}`);
//                 }
//             }
//         }
//     }
// })();
export default router;