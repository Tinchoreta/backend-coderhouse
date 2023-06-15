
import CartManager from '../Business/managers/CartManager.js';
import ProductManager from '../Business/managers/ProductManager.js';

import DataBaseCartManagerAdapter from '../Business/adapters/DataBaseCartManagerAdapter.js';
import DataBaseProductAdapter from '../Business/adapters/DataBaseProductAdapter.js';

const cartMiddleware = async (req, res, next) => {

    try {
        const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(process.env.MONGO_DB_URI);
        const dataBaseCartAdapter = DataBaseCartManagerAdapter.getInstance(process.env.MONGO_DB_URI);

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

export default cartMiddleware;
