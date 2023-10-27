
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

const validateEmail = (email) => {
    // Expresión regular para validar un correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

const cartMiddleware = async (req, res, next) => {
    try {
        const dataBaseProductAdapter = await getDatabaseProductAdapter();
        const dataBaseCartAdapter = await getDatabaseCartAdapter();
        let cartToRender;

        let userEmail = req.user ? req.user.email : null;

        // Si req.query.email está presente, lo usa en lugar de req.user.email
        if (req.query?.email) {
            userEmail = req.query.email;
        }
        
        if (userEmail && validateEmail(userEmail)) {
            // Si el correo es válido, busca el carrito por correo electrónico
            cartToRender = await dataBaseCartAdapter.getCartByUserEmail(userEmail);
        } else if (req.cartManager?.cartList[0]) {
            // Si no hay correo válido, utiliza el carrito existente
            cartToRender = req.cartManager.cartList[0];
        } else if (req.params?.cartId) {
            
            cartToRender = await dataBaseCartAdapter.getCartById(req.params.cartId);
        } else if (req.query?.cartId) {

            cartToRender = await dataBaseCartAdapter.getCartById(req.query.cartId);
        } 

        const productsList = await dataBaseProductAdapter.getProducts(100000, 1, "asc");
        const productManager = new ProductManager(productsList.docs);
        const cartManager = CartManager.getInstance([cartToRender], productManager);

        req.cartManager = cartManager;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
}

async function checkProductExistenceInCart(req, res, next) {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    try {
        const dataBaseCartAdapter = await getDatabaseCartAdapter();
        const productIds = await dataBaseCartAdapter.getProductsIds(cartId);

        // Verifica si algún objeto en el array tiene un campo con el mismo valor que productId
        const exists = productIds.some((product) => product.toLocaleString() === productId);

        if (!exists) {
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



const loadCart = async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const dataBaseCartAdapter = await getDatabaseCartAdapter();
        const cart = await dataBaseCartAdapter.getCartById(cartId);

        if (!cart) {
            // Manejar el caso en que el carrito no se encuentre
            throw new CustomError({
                name: EnumeratedErrors.CART_NOT_FOUND,
                code: EnumeratedErrors.CART_NOT_FOUND.code,
                cause: `Carrito con ID ${cartId} no encontrado.`,
            });
        }

        // Colocar el carrito en req para que esté disponible en el controlador
        req.cart = cart;
        next(); // Continuar con la solicitud
    } catch (error) {
        // Manejar errores y enviar una respuesta de error personalizada si es necesario
        console.error(error);
        if (error instanceof CustomError) {
            return res.status(400).json({ message: error.message, code: error.code });
        } else {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

export { cartMiddleware, checkProductExistenceInCart };