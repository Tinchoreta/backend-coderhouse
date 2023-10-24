import Handlebars from 'handlebars';
import DataBaseCartManagerAdapter from "../../src/Business/adapters/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../src/Business/adapters/DataBaseProductAdapter.js";
import CartManagerController from "../../src/controllers/CartManagerController.js";

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const dataBaseCartAdapter =
    DataBaseCartManagerAdapter.getInstance(process.env.MONGO_DB_URI);

const cartController = new CartManagerController(
    dataBaseCartAdapter,
    dataBaseProductAdapter
);

// Helper para obtener el número de items en el carrito
Handlebars.registerHelper('cartItemCount', async function (options) {
    const cartId = options.data.root.cartId;

    if (cartId) {
        const cart = await dataBaseCartAdapter.getCartById(cartId);
        if (cart) {
            const count = cart.products?.length;
            return count;
        }
    }

    return '0';
});

// Helper para obtener el precio total del carrito
Handlebars.registerHelper('cartTotal', async function (options) {
    const cartId = options.data.root.cartId;

    if (cartId) {
        const total = await dataBaseCartAdapter.calculateCartTotalPrice(cartId);
        return total !== null ? total : '0';
    }

    return '0';
});

// Helper para formatear un precio en formato moneda
Handlebars.registerHelper('formatPrice', function (price) {
    return `$${price.toFixed(2)}`;
});

Handlebars.registerHelper('cartProducts', async function (options) {
    const cartId = options.data.root.cartId;

    if (cartId) {
        const products = await dataBaseCartAdapter.getProducts(cartId);
        if (products.length > 0) {
            let renderedProducts = '';
            for (let i = 0; i < products.length; i++) {
                renderedProducts += options.fn(products[i]);
            }
            return renderedProducts;
        }
    }

    return 'No hay productos disponibles';
});

Handlebars.registerHelper('substring', function (string, start, end) {
    return string.substring(start, end);
});

Handlebars.registerHelper('calculateTotal', function (price, quantity) {
    return String(price * quantity);
});

Handlebars.registerHelper('productQuantity', async function (productId, cartId) {
    if (cartId && productId) {
        const quantity = await dataBaseCartAdapter.getProductQuantity(cartId, productId);
        return quantity;
    }
    return '0';
});


Handlebars.registerHelper('calcTotalWithDiscTax', async function (options) {
    const cartId = options.data.root.cartId;

    if (cartId) {
        const total = await dataBaseCartAdapter.calculateCartTotalPrice(cartId);
        if (total !== null && total !== undefined) {
            return total - 50 + 31;
        } else {
            return 'N/A';
        }
    } else {
        return 'N/A';
    }
});

export default Handlebars;
