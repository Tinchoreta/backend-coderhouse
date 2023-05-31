
import CartManager from '../src/Business/CartManager.js';
import ProductManager from '../src/Business/ProductManager.js';

import DataBaseCartManagerAdapter from '../src/Business/DataBaseCartManagerAdapter.js';
import DataBaseProductAdapter from '../src/Business/DataBaseProductAdapter.js';

const cartMiddleware = async (req, res, next) => {

    try {
        const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(process.env.MONGO_DB_URI);
        const dataBaseCartAdapter = DataBaseCartManagerAdapter.getInstance(process.env.MONGO_DB_URI);


        const cartToRender = await dataBaseCartAdapter.getCartById('64765d546145585e447a0436');
        const productsList = await dataBaseProductAdapter.getProducts();
        const productManager = new ProductManager(productsList);

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
