import Handlebars from 'handlebars';

// Helper para obtener el número de items en el carrito
Handlebars.registerHelper('cartItemCount', function (options) {
    const cartManager = options.data.root.cartManager;

    console.log('cartItemCount helper:', cartManager); // Agregar este console.log
    //TODO:  Change the cart id for this: 64765d546145585e447a0436
    let count = cartManager.getCartTotalItemsQuantity('64765d546145585e447a0436');

    console.log(count);

    return count;
});

// Helper para obtener el precio total del carrito
Handlebars.registerHelper('cartTotal', function (options) {
    const cartManager = options.data.root.cartManager;

    console.log('cartTotal helper:', cartManager); // Agregar este console.log

    let result = cartManager.calculateTotalPrice('64765d546145585e447a0436');

    console.log(result);

    return result;
});

// Helper para formatear un precio en formato moneda
Handlebars.registerHelper('formatPrice', function (price) {
    return `$${price.toFixed(2)}`;
});

export default Handlebars;
