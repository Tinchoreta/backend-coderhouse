/**
 * Controlador para gestionar el carrito de compras.
 */

import Ticket from "../models/ticket.model.js";
class CartManagerController {
    /**
     * Crea una nueva instancia del controlador del carrito de compras.
     * @param {Object} cartManagerAdapter - Adaptador para gestionar el carrito.
     * @param {Object} productManagerAdapter - Adaptador para gestionar los productos.
     */
    constructor(cartManagerAdapter, productManagerAdapter) {
        this.cartManagerAdapter = cartManagerAdapter;
        this.productManagerAdapter = productManagerAdapter;
    }

    /**
     * Método privado para validar si el carrito existe.
     * @private
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {string} cid - ID del carrito.
     * @returns {boolean|Object} - El carrito si existe, de lo contrario, false.
     */
    #_validateCartExists = async (res, cid) => {
        try {
            const cart = await this.cartManagerAdapter.getCartById(cid);
            if (!cart) {
                res.status(404).send('Cart not found');
                return false;
            }
            return cart;
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
            return false;
        }
    }

    /**
     * Método privado para validar si el producto existe.
     * @private
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {string} pid - ID del producto.
     * @returns {boolean|Object} - El producto si existe, de lo contrario, false.
     */
    #_validateProductExists = async (res, pid) => {
        try {
            const product = await this.productManagerAdapter.getProductById(pid);
            if (!product) {
                res.status(404).send('Product not found');
                return false;
            }
            return product;
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
            return false;
        }
    }

    /**
     * Verifica si hay suficiente stock disponible para agregar al carrito.
     * @private
     * @param {number} availableUnits - Unidades disponibles.
     * @param {number} unitsToAdd - Unidades a agregar.
     * @returns {boolean} - `true` si hay suficiente stock, de lo contrario, `false`.
     */
    #hasEnoughStock(availableUnits, unitsToAdd) {
        return availableUnits >= unitsToAdd;
    }

    /**
     * Envía una respuesta de error al cliente.
     * @private
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {number} code - Código de estado HTTP del error.
     * @param {string} message - Mensaje de error.
     */
    #sendError(res, code, message) {
        res.status(code).json({ error: message });
    }

    /**
     * Crea un nuevo carrito.
     * @param {Object} request - Objeto de solicitud HTTP.
     * @param {Object} response - Objeto de respuesta HTTP.
     */
    async createCart(request, response) {
        try {
            const addedCartId = await this.cartManagerAdapter.createCart();
            if (!addedCartId) {
                response.status(500).json({
                    success: false,
                    error: "Error creating cart."
                });
                return;
            }
            response.status(201).json({
                success: true,
                response: addedCartId
            });
        } catch (error) {
            console.error(error);
            response.status(500).json({
                success: false,
                error: "Error creating cart."
            });
        }
    }

    /**
     * Obtiene todos los carritos.
     * @param {Object} request - Objeto de solicitud HTTP.
     * @param {Object} response - Objeto de respuesta HTTP.
     * @returns {Object} - La lista de carritos.
     */
    async getCarts(request, response) {
        try {
            // const carts = await this.cartManagerAdapter.getCarts();
            const limit = !Number.isNaN(parseInt(request.query.limit)) ? parseInt(request.query.limit) : 5;

            const populatedCarts = await this.cartManagerAdapter.populateProducts({ limit: limit });
            return response.status(200).json({
                success: true,
                response: populatedCarts
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    }

    /**
     * Obtiene un carrito por su ID.
     * @param {Object} request - Objeto de solicitud HTTP.
     * @param {Object} response - Objeto de respuesta HTTP.
     * @returns {Object} - El carrito encontrado.
     */
    async getCartById(request, response) {
        try {
            const cartId = request.params.id;
            const cartFounded = await this.cartManagerAdapter.getCartById(cartId);
            if (cartFounded) {
                return response.status(200).json({
                    success: true,
                    cart: cartFounded
                });
            } else {
                return response.status(404).json({
                    success: false,
                    error: 'Cart not found'
                });
            }
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    }

    /**
     * Actualiza un producto en el carrito.
     * @param {Object} request - Objeto de solicitud HTTP.
     * @param {Object} response - Objeto de respuesta HTTP.
     */
    async updateCartItem(request, response) {
        const cartId = request.params.id;
        const updatedProduct = request.body;
        const updatedItem = await this.cartManagerAdapter.updateCart({ _id: cartId, products: updatedProduct });
        response.status(200).json(updatedItem);
    }

    /**
     * Agrega unidades de un producto al carrito.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    async addProductUnitsToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const unitsToAdd = Number(req.params.units);

        if (!cartId || !productId || isNaN(unitsToAdd) || unitsToAdd <= 0) {
            return this.#sendError(res, 400, 'Invalid parameters');
        }

        const cart = await this.#_validateCartExists(res, cartId);

        if (!cart) {
            return this.#sendError(res, 404, 'Cart not found');
        }

        const product = await this.#_validateProductExists(res, productId);

        if (!product) {
            return this.#sendError(res, 404, 'Product not found');
        }

        const productInCart = cart.products.find(p => p.productId === productId);
        const currentUnits = productInCart ? productInCart.quantity : 0;
        const availableUnits = product.stock - currentUnits;

        if (!this.#hasEnoughStock(availableUnits, unitsToAdd)) {
            return this.#sendError(res, 400, 'Not enough stock');
        }

        const unitsToAddRestrained = unitsToAdd > availableUnits ? availableUnits : unitsToAdd;

        if (productInCart) {
            productInCart.quantity += unitsToAddRestrained;
        } else {
            cart.products.push({ productId, quantity: unitsToAddRestrained });
        }

        const updatedCart = await this.cartManagerAdapter.updateCart(cart);

        res.send(updatedCart);
    }

    /**
     * Elimina unidades de un producto del carrito.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    async removeProductUnitsFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            let unitsToRemove = Number(req.params.units);

            if (!cartId || !productId || isNaN(unitsToRemove) || unitsToRemove <= 0) {
                return this.#sendError(res, 400, 'Invalid parameters');
            }

            const cart = await this.#_validateCartExists(res, cartId);

            if (!cart || typeof cart === 'undefined') {
                return this.#sendError(res, 404, 'Cart not found');
            }

            const product = await this.#_validateProductExists(res, productId);

            if (!product || typeof product === 'undefined') {
                return this.#sendError(res, 404, 'Product not found');
            }

            // Validamos que la cantidad de unidades a quitar no sea mayor a la cantidad de unidades en el carrito
            const itemInCart = cart.products.find((item) => item.productId === productId);
            if (itemInCart) {
                if (unitsToRemove >= itemInCart.quantity) {
                    unitsToRemove = itemInCart.quantity;
                }
            }

            // Se actualiza la cantidad del producto en el carrito
            const cartItemIndex = cart.products.findIndex((item) => item.productId === productId);
            if (cartItemIndex !== -1) {
                cart.products[cartItemIndex].quantity -= unitsToRemove;
                if (cart.products[cartItemIndex].quantity === 0) {
                    // Se borra directamente el producto del carrito
                    cart.products.splice(cartItemIndex, 1);
                }
            }

            const updatedCart = await this.cartManagerAdapter.updateCart(cart);

            return res.status(200).json(updatedCart);
        } catch (error) {
            console.error(error);
            return this.#sendError(res, 500, 'Internal server error');
        }
    }

    /**
     * Elimina un producto del carrito.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    async removeProductFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            if (!cartId || !productId) {
                return this.#sendError(res, 400, 'Invalid parameters');
            }

            const cart = await this.#_validateCartExists(res, cartId);

            if (!cart) {
                return this.#sendError(res, 404, 'Cart not found');
            }

            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

            if (productIndex === -1) {
                return this.#sendError(res, 404, 'Product not found in cart');
            }

            cart.products.splice(productIndex, 1);

            const updatedCart = await this.cartManagerAdapter.updateCart(cart);

            return res.status(200).json(updatedCart);
        } catch (error) {
            console.error(error);
            return this.#sendError(res, 500, 'Internal server error');
        }
    }

    /**
     * Calcula el precio total del carrito.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    async calculateCartTotalPrice(req, res) {
        try {
            const cartId = req.params.cid;

            const totalPrice = await this.cartManagerAdapter.calculateCartTotalPrice(cartId);

            res.status(200).json({ totalPrice });
        } catch (error) {
            console.error('Failed to calculate cart total price:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Elimina un carrito.
     * @param {Object} request - Objeto de solicitud HTTP.
     * @param {Object} response - Objeto de respuesta HTTP.
     */
    async deleteCart(request, response) {
        const cartId = request.params.id;
        await this.cartManagerAdapter.deleteCart(cartId);
        response.status(204).send();
    }

    async processPurchase(req, res) {
        try {
            const userId = req.user._id;
            const productsNotPurchased = []; // Almacenar productos que no se pudieron comprar

            // Función para verificar el stock de un producto
            const checkProductStock = async (item) => {
                const product = await this.dataBaseProductAdapter.getProductById(item.productId);
                if (!product) {
                    throw new CustomError({
                        name: EnumeratedErrors.PRODUCT_NOT_FOUND,
                        code: EnumeratedErrors.PRODUCT_NOT_FOUND.code,
                        cause: `Producto con ID ${item.productId} no encontrado.`,
                    });
                }
                if (product.stock < item.quantity) {
                    // Registra los productos que no se pueden comprar
                    productsNotPurchased.push(item.productId);
                }
                return product;
            };

            // Verificar el stock de todos los productos
            await Promise.all(req.cart.products.map(checkProductStock));

            // Actualizar el stock y registrar la compra para los productos comprables
            const productsPurchased = await Promise.all(req.cart.products.map(async (item) => {
                if (!productsNotPurchased.includes(item.productId)) {
                    const product = await this.dataBaseProductAdapter.getProductById(item.productId);
                    if (product) {
                        product.stock -= item.quantity;
                        await this.dataBaseProductAdapter.updateProduct(product);
                        return item;
                    }
                }
                return null;
            }));

            // Filtrar los productos que se compraron con éxito
            const purchasedProducts = productsPurchased.filter(item => item !== null);

            // Actualizar el carrito con los productos no comprados
            req.cart.products = purchasedProducts;
            req.cart.totalAmount = purchasedProducts.reduce((total, item) => total + item.price * item.quantity, 0);
            await req.cart.save();

            if (purchasedProducts.length > 0) {
                // Crear un nuevo ticket (pedido) solo si se compraron productos
                const newTicket = new Ticket({
                    code: generateUniqueCode(),
                    amount: req.cart.totalAmount,
                    purchaser: userId,
                });

                // Guardar el ticket en la base de datos
                const ticket = await newTicket.save();

                // Responder con los productos que no se pudieron comprar
                return res.status(200).json({ message: 'Compra exitosa', ticket, productsNotPurchased });
            } else {
                // Responder con un mensaje indicando que todos los productos estaban fuera de stock
                throw new CustomError({
                    name: EnumeratedErrors.CART_EMPTY_ERROR,
                    code: EnumeratedErrors.CART_EMPTY_ERROR.code,
                    cause: 'Ningún producto se pudo comprar debido a la falta de stock',
                });
            }
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                return res.status(400).json({ message: error.message, code: error.code });
            } else {
                    return res.status(500).json({ message: 'Error en la compra' });
            }
        }
    }
}

export default CartManagerController;
