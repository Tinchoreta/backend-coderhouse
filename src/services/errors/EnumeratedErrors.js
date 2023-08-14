const EnumeratedErrors = {
    ROUTING_ERROR: {
        code: 1,
        message: "Error en la ruta o en la navegación"
    },

    // Errores de tipo inválido
    INVALID_TYPE_ERROR: {
        code: 2,
        message: "El tipo de dato es inválido o no es el esperado"
    },

    // Errores de base de datos
    DATABASE_ERROR: {
        code: 3,
        message: "Error en la base de datos"
    },

    // Errores de productos
    PRODUCT_NOT_FOUND: {
        code: 4,
        message: "El producto no se encontró"
    },
    PRODUCT_CREATION_ERROR: {
        code: 5,
        message: "No se pudo crear el producto"
    },
    PRODUCT_UPDATE_ERROR: {
        code: 6,
        message: "No se pudo actualizar el producto"
    },

    // Errores de usuarios
    USER_NOT_FOUND: {
        code: 7,
        message: "El usuario no se encontró"
    },
    USER_REGISTRATION_ERROR: {
        code: 8,
        message: "No se pudo registrar al usuario"
    },
    USER_AUTHENTICATION_ERROR: {
        code: 9,
        message: "Error en la autenticación del usuario"
    },

    // Errores del carrito de compras
    CART_ADD_ERROR: {
        code: 10,
        message: "No se pudo agregar el producto al carrito"
    },
    CART_REMOVE_ERROR: {
        code: 11,
        message: "No se pudo quitar el producto del carrito"
    },
    CART_CHECKOUT_ERROR: {
        code: 12,
        message: "No se pudo procesar el pago del carrito"
    },
    ADMIN_PRODUCT_CREATION_ERROR: {
        code: 13,
        message: "Error al crear un producto como administrador"
    },
    ADMIN_PRODUCT_UPDATE_ERROR: {
        code: 14,
        message: "Error al actualizar un producto como administrador"
    },

    // Errores del carrito de compras
    CART_EMPTY_ERROR: {
        code: 15,
        message: "El carrito de compras está vacío"
    },
    CART_ITEM_QUANTITY_ERROR: {
        code: 16,
        message: "La cantidad de un producto en el carrito es inválida"
    },
    CART_DUPLICATE_ITEM_ERROR: {
        code: 17,
        message: "El producto ya está en el carrito"
    },

    // Errores de pago
    PAYMENT_PROCESSING_ERROR: {
        code: 18,
        message: "Error en el procesamiento del pago"
    },
    PAYMENT_GATEWAY_ERROR: {
        code: 19,
        message: "Error en la pasarela de pago"
    },
    PAYMENT_AMOUNT_ERROR: {
        code: 20,
        message: "El monto de pago es inválido"
    }
};

export default EnumeratedErrors;