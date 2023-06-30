import Handlebars from 'handlebars';

// Helper para obtener el número de items en el carrito
Handlebars.registerHelper('cartItemCount', function (options) {
    const cartManager = options.data.root.cartManager;

    // console.log('cartItemCount helper:', cartManager); // Agregar este console.log
    //TODO:  Change the cart id 64765d546145585e447a0436 hardcoded
    let count = cartManager?.getCartTotalItemsQuantity('64765d546145585e447a0436');

    // console.log(count);

    return count;
});

// Helper para obtener el precio total del carrito
Handlebars.registerHelper('cartTotal', function (options) {
    const cartManager = options.data.root.cartManager;

    // console.log('cartTotal helper:', cartManager); // Agregar este console.log

    let result = cartManager?.calculateTotalPrice('64765d546145585e447a0436');

    // console.log(result);

    return result;
});

// Helper para formatear un precio en formato moneda
Handlebars.registerHelper('formatPrice', function (price) {
    return `$${price.toFixed(2)}`;
});

Handlebars.registerHelper('cartProducts', function (options) {
    const cartManager = options.data.root.cartManager;

    // Obtener el array de productos del carrito
    let products = cartManager.getProducts('64765d546145585e447a0436');

    // Renderizar cada objeto producto en el array
    let renderedProducts = '';
    for (let i = 0; i < products.length; i++) {
        // Ejecutar el bloque de código dentro de {{#each}} para cada producto
        renderedProducts += options.fn(products[i]);
    }

    return renderedProducts;
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
    const total = cartManager.calculateTotalPrice('64765d546145585e447a0436');
    return total - 50 + 31;
});

export default Handlebars;
