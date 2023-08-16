
import CartManager from '../../Business/managers/CartManager.js';
import ProductManager from '../../Business/managers/ProductManager.js';

import DataBaseCartManagerAdapter from '../../Business/adapters/DataBaseCartManagerAdapter.js';
import DataBaseProductAdapter from '../../Business/adapters/DataBaseProductAdapter.js';

import CustomError from "../../services/errors/CustomError.js";
import EnumeratedErrors from "../../services/errors/EnumeratedErrors.js";

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

        // TODO: Change this hardcoded cartID
        const cartToRender = await dataBaseCartAdapter.getCartById('64765d546145585e447a0436');
        const productsList = await dataBaseProductAdapter.getProducts(100000, 1, "asc");
        const productManager = new ProductManager(productsList.docs);

        const cartManager = CartManager.getInstance([cartToRender], productManager);

        req.cartManager = cartManager;

        next();
    } catch (error) {
        console.error(error);
        next(new CustomError({
            name: EnumeratedErrors.DATABASE_ERROR,
            cause: error.message
        }));
    }
}


async function checkProductExistenceInCart(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const dataBaseCartAdapter = await getDatabaseCartAdapter();
        const productIds = await dataBaseCartAdapter.getProductsIds(cartId);

        if (!productIds.includes(productId)) {
            throw new CustomError({
                name: EnumeratedErrors.VALIDATION_ERROR,
                message: "Product does not exist in cart"
            });
        }

        next();
    } catch (error) {
        next(new CustomError({
            name: EnumeratedErrors.DATABASE_ERROR,
            cause: error.message
        }));
    }
}


export { cartMiddleware, checkProductExistenceInCart };