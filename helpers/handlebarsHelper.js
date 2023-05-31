import Handlebars from 'handlebars';

// Helper para obtener el número de items en el carrito
Handlebars.registerHelper('cartItemCount', function (options) {
    const cartManager = options.data.root.cartManager;

    console.log('cartItemCount helper:', cartManager); // Agregar este console.log
    //TODO:  Change the cart id for this: 64765d546145585e447a0436
    let count = cartManager.getCartTotalItemsQuantity('64765d546145585e447a0436');

    // console.log(count);

    return count;
});

// Helper para obtener el precio total del carrito
Handlebars.registerHelper('cartTotal', function (options) {
    const cartManager = options.data.root.cartManager;

    // console.log('cartTotal helper:', cartManager); // Agregar este console.log

    let result = cartManager.calculateTotalPrice('64765d546145585e447a0436');

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


export default Handlebars;
