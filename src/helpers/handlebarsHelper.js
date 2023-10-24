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
Handlebars.registerHelper('cartItemCount', function (options) {
    
    const cartId = options.data.root.cartId;

    if (cartId) {
        const count = cartManager.getCartTotalItemsQuantity(cartId);
        return count !== null && count !== undefined ? count : '0';
    } else {
        return '0';
    }
});

// Helper para obtener el precio total del carrito
Handlebars.registerHelper('cartTotal', function (options) {
    
    const cartId = options.data.root.cartId;

    if (cartId) {
        const result = cartManager.calculateTotalPrice(cartId);
        return result !== null && result !== undefined ? result : '0';
    } else {
        return '0';
    }
});

// Helper para formatear un precio en formato moneda
Handlebars.registerHelper('formatPrice', function (price) {
    return `$${price.toFixed(2)}`;
});

Handlebars.registerHelper('cartProducts', function (options) {
    
    const cartId = options.data.root.cartId;

    if (cartId) {
        let products = cartManager.getProducts(cartId);

        // Renderizar cada objeto producto en el array
        let renderedProducts = '';
        for (let i = 0; i < products.length; i++) {
            // Ejecutar el bloque de código dentro de {{#each}} para cada producto
            renderedProducts += options.fn(products[i]);
        }
        return renderedProducts;
    } else {
        return 'No hay productos disponibles';
    }
});

Handlebars.registerHelper('substring', function (string, start, end) {
    return string.substring(start, end);
});

Handlebars.registerHelper('calculateTotal', function (price, quantity) {
    return String(price * quantity);
});

// calcTotalWithDiscTax

Handlebars.registerHelper('calcTotalWithDiscTax', function (options) {
    const cartManager = options.data.root.cartManager;
    const cartId = options.data.root.cartId;

    if (cartId) {
        const total = cartManager.calculateTotalPrice(cartId);
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
