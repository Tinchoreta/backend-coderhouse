
import Handlebars from 'handlebars';

// Helper para obtener el número de items en el carrito
export function cartItemCount(cartManager) {
    return cartManager.getCartTotalItemsQuantity(1);
}

// Helper para obtener el precio total del carrito
export function cartTotal(cartManager) {
    return cartManager.calculateTotalPrice(1);
}

// Helper para formatear un precio en formato moneda
export function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Registro de los helpers en la instancia de Handlebars
Handlebars.registerHelper('cartItemCount', cartItemCount);
Handlebars.registerHelper('cartTotal', cartTotal);
Handlebars.registerHelper('formatPrice', formatPrice);

export default Handlebars;
