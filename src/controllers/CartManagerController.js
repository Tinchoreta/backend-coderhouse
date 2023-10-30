import CustomError from "../services/errors/CustomError.js";
import Ticket from "../models/ticket.model.js";
import EnumeratedErrors from "../services/errors/EnumeratedErrors.js";
import HTTP_STATUS_CODES from "../utils/httpStatusCodes.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
class CartManagerController {
    constructor(cartManagerAdapter, productManagerAdapter) {
        this.cartManagerAdapter = cartManagerAdapter;
        this.productManagerAdapter = productManagerAdapter;
    }

    #_validateCartExists = async (res, cartId) => {
        try {
            const cart = await this.cartManagerAdapter.getCartById(cartId);
            if (!cart) {
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send('Cart not found');
                return false;
            }
            return cart;
        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send('Internal server error');
            return false;
        }
    }

    #_validateProductExists = async (res, productId) => {
        try {
            const product = await this.productManagerAdapter.getProductById(productId);
            if (!product) {
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send('Product not found');
                return false;
            }
            return product;
        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send('Internal server error');
            return false;
        }
    }

    #hasEnoughStock(availableUnits, unitsToAdd) {
        return availableUnits >= unitsToAdd;
    }

    #sendError(res, code, message) {
        res.status(code).json({ error: message });
    }

    async createCart(request, response) {
        try {

            const userEmail = request.user.email;

            const addedCartId = await this.cartManagerAdapter.createCart(userEmail);
            if (!addedCartId) {
                response.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error creating cart."
                });
                return;
            }
            response.status(HTTP_STATUS_CODES.HTTP_CREATED).json({
                success: true,
                response: addedCartId
            });
        } catch (error) {
            console.error(error);
            response.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error creating cart."
            });
        }
    }

    async getCartByUserEmail(request, response) {
        try {
            let userEmail;

            if (request.params?.email) {
                userEmail = request.params.email;
            } else if (request.user?.email) {
                userEmail = request.user.email;
            }


            if (!userEmail) {
                return response.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).json({
                    success: false,
                    error: "Email is required in the request parameters."
                });
            }

            // Busca el usuario por correo electrónico
            const user = await User.findOne({ email: userEmail });

            if (user) {
                // Si se encuentra el usuario, busca el carrito asociado por userId
                const cart = await this.cartManagerAdapter.getCartByUserEmail(userEmail);

                if (cart) {
                    return response.status(HTTP_STATUS_CODES.HTTP_OK).json({
                        success: true,
                        cart: cart
                    });
                } else {
                    return response.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).json({
                        success: false,
                        error: "Cart not found for the given email."
                    });
                }
            } else {
                return response.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).json({
                    success: false,
                    error: "User not found for the given email."
                });
            }
        } catch (error) {
            console.error(`Error al obtener el carrito por correo electrónico del usuario: ${error.message}`);
            return response.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    }

    async searchOrCreateCart(userEmail) {
        // Buscar el carrito asociado al email del usuario
        const cart = await this.cartManagerAdapter.getCartByUserEmail(userEmail);

        if (cart) {
            return cart;
        } else {
            // Si no se encuentra el carrito, crear uno nuevo
            const addedCartId = await this.cartManagerAdapter.createCart(userEmail);

            if (!addedCartId) {
                throw new Error("Error creating cart.");
            }

            // Obtener y devolver el carrito recién creado
            return this.cartManagerAdapter.getCartById(addedCartId);
        }
    }


    async getCartManager(request, response) {
        try {

            response.json({ cartManager: request.cartManager });

        } catch (error) {
            console.error(error);
            return response.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal Server Error'
            });
        }

    }

    async getCarts(request, response) {
        try {
            const limit = !Number.isNaN(parseInt(request.query.limit)) ? parseInt(request.query.limit) : 5;

            const populatedCarts = await this.cartManagerAdapter.populateProducts({ limit: limit });
            return response.status(HTTP_STATUS_CODES.HTTP_OK).json({
                success: true,
                response: populatedCarts
            });
        } catch (error) {
            console.error(error);
            return response.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    }

    async getCartById(request, response) {
        try {
            const cartId = request.params.cartId;

            const cartFounded = await this.cartManagerAdapter.getCartById(cartId);

            if (cartFounded) {
                const populatedCart = await this.cartManagerAdapter.populateProductsById(cartId);
                return response.status(HTTP_STATUS_CODES.HTTP_OK).json({
                    success: true,
                    cart: populatedCart,
                });
            } else {
                return response.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).json({
                    success: false,
                    error: 'Cart not found'
                });
            }
        } catch (error) {
            console.error(error);
            return response.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    }

    async updateCartItem(request, response) {
        const cartId = request.params.cartId;
        const updatedProduct = request.body;
        const updatedItem = await this.cartManagerAdapter.updateCart({ _id: cartId, products: updatedProduct });
        response.status(HTTP_STATUS_CODES.HTTP_OK).json(updatedItem);
    }

    async addProductUnitsToCart(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const unitsToAdd = Number(req.params.units);

        if (!cartId || !productId || isNaN(unitsToAdd) || unitsToAdd <= 0) {
            return this.#sendError(res, HTTP_STATUS_CODES.HTTP_BAD_REQUEST, 'Invalid parameters');
        }

        const cart = await this.#_validateCartExists(res, cartId);

        if (!cart) {
            return this.#sendError(res, HTTP_STATUS_CODES.HTTP_NOT_FOUND, 'Cart not found');
        }

        const product = await this.#_validateProductExists(res, productId);

        if (!product) {
            return this.#sendError(res, HTTP_STATUS_CODES.HTTP_NOT_FOUND, 'Product not found');
        }

        const productInCart = cart.products.find(p => p.productId === productId);
        const currentUnits = productInCart ? productInCart.quantity : 0;
        const availableUnits = product.stock - currentUnits;

        if (!this.#hasEnoughStock(availableUnits, unitsToAdd)) {
            return this.#sendError(res, HTTP_STATUS_CODES.HTTP_BAD_REQUEST, 'Not enough stock');
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

    async removeProductUnitsFromCart(req, res) {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;
            let unitsToRemove = Number(req.params.units);

            if (!cartId || !productId || isNaN(unitsToRemove) || unitsToRemove <= 0) {
                return this.#sendError(res, HTTP_STATUS_CODES.HTTP_BAD_REQUEST, 'Invalid parameters');
            }

            const cart = await this.#_validateCartExists(res, cartId);

            if (!cart || typeof cart === 'undefined') {
                return this.#sendError(res, HTTP_STATUS_CODES.HTTP_NOT_FOUND, 'Cart not found');
            }

            const product = await this.#_validateProductExists(res, productId);

            if (!product || typeof product === 'undefined') {
                return this.#sendError(res, HTTP_STATUS_CODES.HTTP_NOT_FOUND, 'Product not found');
            }

            const productObjectId = new mongoose.Types.ObjectId(productId);
            const itemInCart = cart.products.find((item) => item.productId.equals(productObjectId));

            if (itemInCart) {
                if (unitsToRemove >= itemInCart.quantity) {
                    unitsToRemove = itemInCart.quantity;
                }
            }

            const cartItemIndex = cart.products.findIndex((item) => item.productId.equals(productObjectId));
            if (cartItemIndex !== -1) {
                cart.products[cartItemIndex].quantity -= unitsToRemove;
                if (cart.products[cartItemIndex].quantity === 0) {
                    cart.products.splice(cartItemIndex, 1);
                }
            }

            const updatedCart = await this.cartManagerAdapter.updateCart(cart);

            return res.status(HTTP_STATUS_CODES.HTTP_OK).json(updatedCart);
        } catch (error) {
            console.error(error);
            return this.#sendError(res, HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR, 'Internal server error');
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;

            if (!cartId || !productId) {
                return this.#sendError(res, HTTP_STATUS_CODES.HTTP_BAD_REQUEST, 'Invalid parameters');
            }

            const cart = await this.#_validateCartExists(res, cartId);

            if (!cart) {
                return this.#sendError(res, HTTP_STATUS_CODES.HTTP_NOT_FOUND, 'Cart not found');
            }

            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

            if (productIndex === -1) {
                return this.#sendError(res, HTTP_STATUS_CODES.HTTP_NOT_FOUND, 'Product not found in cart');
            }

            cart.products.splice(productIndex, 1);

            const updatedCart = await this.cartManagerAdapter.updateCart(cart);

            return res.status(HTTP_STATUS_CODES.HTTP_OK).json(updatedCart);
        } catch (error) {
            console.error(error);
            return this.#sendError(res, HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR, 'Internal server error');
        }
    }

    async calculateCartTotalPrice(req, res) {
        try {
            const cartId = req.params?.cartId;

            const totalPrice = await this.cartManagerAdapter.calculateCartTotalPrice(cartId);

            res.status(HTTP_STATUS_CODES.HTTP_OK).json({ totalPrice: totalPrice });
        } catch (error) {
            console.error('Failed to calculate cart total price:', error);
            res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async getCartTotalItemsQuantity(req, res) {
        try {
            const cartId = req.params.cartId;
            const itemCount = await this.cartManagerAdapter.getCartTotalItemsQuantity(cartId); // Asegúrate de tener el cartId

            if (itemCount !== null) {
                res.status(HTTP_STATUS_CODES.HTTP_OK).json({ count: itemCount });
            } else {
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).json({ error: 'Carrito no encontrado' });
            }
        } catch (error) {
            res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Error al obtener la cantidad de elementos del carrito.' });
        }
    }

    async deleteCart(request, response) {
        const cartId = request.params.id;
        await this.cartManagerAdapter.deleteCart(cartId);
        response.status(HTTP_STATUS_CODES.HTTP_NO_CONTENT).send();
    }

    async processPurchase(req, res) {
        try {
            const userId = req?.username;  // Verifica que req y req.username no sean nulos o indefinidos
            const cartId = req?.cartId || req?.params?.cartId; // Verifica que req y req.cartId no sean nulos o indefinidos

            if (this.isNullOrUndefined(cartId)) {
                throw new CustomError({
                    name: EnumeratedErrors.VALIDATION_ERROR,
                    message: 'Invalid request data',
                });
            }

            if (this.isNullOrUndefined(userId)) {
                this.cartManagerAdapter.getUserIdForCart(cartId);
            }

            const cart = await this.cartManagerAdapter.getCartById(cartId);

            if (this.isNullOrUndefined(cart)) {
                throw new CustomError({
                    name: EnumeratedErrors.CART_NOT_FOUND,
                    message: 'Cart not found',
                });
            }

            const productsNotPurchased = await this.checkStockForProducts(cart?.products); // Verifica que cart y cart.products no sean nulos o indefinidos

            const purchasedProducts = await this.processPurchasableProducts(cart?.products, productsNotPurchased); // Verifica que cart y cart.products no sean nulos o indefinidos

            const totalAmount = await this.cartManagerAdapter.calculateCartTotalPrice(cartId);

            await this.updateCartAndProducts(cart, purchasedProducts);

            if (purchasedProducts?.length > 0) { // Verifica que purchasedProducts no sea nulo o indefinido
                const ticket = await this.createTicket(totalAmount, userId);

                return res.status(HTTP_STATUS_CODES.HTTP_OK).json({
                    message: 'Compra exitosa',
                    ticket,
                    purchasedProducts
                });
            } else {
                throw new CustomError({
                    name: EnumeratedErrors.CART_EMPTY_ERROR,
                    code: EnumeratedErrors.CART_EMPTY_ERROR.code,
                    cause: 'Ningún producto se pudo comprar debido a la falta de stock',
                });
            }
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                return res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).json({ message: error.message, code: error.code });
            } else {
                return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({ message: 'Error en la compra' });
            }
        }
    }
    
    isNullOrUndefined(value) {
        return value === null || value === undefined;
    }

    async checkStockForProducts(products) {
        const productsNotPurchased = [];
        const checkProductStockPromises = products.map(async (item) => {
            const product = await this.productManagerAdapter.getProductById(item.productId);
            if (!product) {
                throw new CustomError({
                    name: EnumeratedErrors.PRODUCT_NOT_FOUND,
                    code: EnumeratedErrors.PRODUCT_NOT_FOUND.code,
                    cause: `Producto con ID ${item.productId} no encontrado.`,
                });
            }
            if (product.stock < item.quantity) {
                productsNotPurchased.push(item.productId);
            }
        });
        await Promise.all(checkProductStockPromises);
        return productsNotPurchased;
    }

    async processPurchasableProducts(products, productsNotPurchased) {
        const processPurchasableProductPromises = products.map(async (item) => {
            if (!productsNotPurchased.includes(item.productId)) {
                const product = await this.productManagerAdapter.getProductById(item.productId);
                if (product) {
                    product.stock -= item.quantity;
                    await this.productManagerAdapter.updateProduct(product);
                    return item;
                }
            }
            return null;
        });
        const purchasedProducts = await Promise.all(processPurchasableProductPromises);
        return purchasedProducts.filter(item => item !== null);
    }

    async updateCartAndProducts(cart, purchasedProducts) {
        cart.products = purchasedProducts;
        await this.cartManagerAdapter.updateCart(cart);
    }

    async createTicket(totalAmount, userId) {
        const newTicket = new Ticket({
            code: generateUniqueCode(),
            amount: totalAmount,
            purchaser: userId,
        });
        return await newTicket.save();
    }
}

function generateUniqueCode() {
    // Genera un código único basado en la fecha y hora actual
    return `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export default CartManagerController;
