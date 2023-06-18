
import CartManager from '../Business/managers/CartManager.js';
import ProductManager from '../Business/managers/ProductManager.js';

import DataBaseCartManagerAdapter from '../Business/adapters/DataBaseCartManagerAdapter.js';
import DataBaseProductAdapter from '../Business/adapters/DataBaseProductAdapter.js';

async function getDatabaseCartAdapter() {
    const mongoDBURI = process.env.MONGO_DB_URI;
    return DataBaseCartManagerAdapter.getInstance(mongoDBURI);
}

async function getDatabaseProductAdapter() {
    const mongoDBURI = process.env.MONGO_DB_URI;
    return DataBaseProductAdapter.getInstance(mongoDBURI);
}

const cartMiddleware = async (req, res, next) => {

    try {
        const dataBaseProductAdapter = await getDatabaseProductAdapter();
        const dataBaseCartAdapter = await getDatabaseCartAdapter();

        //TODO: Change this hard-coded cartID

        const cartToRender = await dataBaseCartAdapter.getCartById('64765d546145585e447a0436');
        const productsList = await dataBaseProductAdapter.getProducts(20,1,"asc");
        const productManager = new ProductManager(productsList.products);

        const cartManager = CartManager.getInstance([cartToRender], productManager);


        // Agrega el carrito de compras al objeto req para que esté disponible en todas las rutas
        req.cartManager = cartManager;

        next();

    } catch (error) {
        console.error(error);
        next(error);

    }
}

async function checkProductExistenceInCart(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const dataBaseCartAdapter = await getDatabaseCartAdapter();
        // Verificar si el producto existe en el carrito
        const productIds = await dataBaseCartAdapter.getProductsIds(cartId);

        if (!productIds.includes(productId)) {
            return res.status(400).json({ success: false, error: "Product does not exist in cart" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export { cartMiddleware, checkProductExistenceInCart };