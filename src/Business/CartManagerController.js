class CartManagerController {

    /*
        LISTA DE CÓDIGOS DE ESTADO HTTP
        200 “OK” – La respuesta para una solicitud HTTP exitosa. El resultado dependerá del tipo de solicitud.
        201 “Created” – La solicitud se cumplió y el servidor creó un nuevo recurso.
        204 “No Content” – El servidor cumplió con la solicitud pero no devolverá ningún contenido.
        400 “Bad Request” – El servidor no puede devolver una respuesta válida debido a un error del lado del cliente. Las causas comunes son URL solicitadas con formato incorrecto, enrutamiento de solicitud engañoso, tamaño de archivo grande, etc.
        404 “Not found” – Este es el error más frecuente que ven los usuarios en línea. Significa que el servidor no puede encontrar el recurso solicitado. Por lo general, la causa es que la URL a la que intentas acceder no existe.
        500 “Internal Server Error” – Es un error genérico que indica que el servidor encontró una condición inesperada y no puede cumplir con la solicitud. El servidor te dice que hay algo mal, pero no está seguro de cuál es el problema.
    */

    constructor(cartManagerAdapter, productManagerAdapter) {
        this.cartManagerAdapter = cartManagerAdapter;
        this.productAdapter = productManagerAdapter;
    }

    //Método privado, utilizado solo internamente y no puede accederse a él desde fuera de la clase

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

    #_validateProductExists = async (res, pid) => {
        try {
            const product = await this.productAdapter.getProductById(pid);

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

    #hasEnoughStock(availableUnits, unitsToAdd) {
        return availableUnits >= unitsToAdd;
    }

    #sendError(res, code, message) {
        res.status(code).json({ error: message });
    }

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
            response.status(201).json(addedCartId);
        } catch (error) {
            console.error(error);
            response.status(500).json({
                sucess: false,
                error: "Error creating cart."
            });
        }
    }

    async getCarts(request, response) {
        try {
            const carts = await this.cartManagerAdapter.getCarts();
            const limit = parseInt(request.query.limit);

            if (isNaN(limit)) {
                return response.status(200).json({
                    success: true,
                    response: carts
                });
            } else {
                const limitedCarts = carts.slice(0, limit);
                return response.status(200).json({
                    success: true,
                    response: limitedCarts
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

    async updateCartItem(request, response) {
        const cartId = request.params.id;
        const updatedProduct = request.body;
        const updatedItem = await this.cartManagerAdapter.updateCart({ id: cartId, products: updatedProduct });
        response.status(200).json(updatedItem);
    }

    async addProductUnitsToCart(req, res) {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const unitsToAdd = Number(req.params.units);

        if (isNaN(cartId) || isNaN(productId) || isNaN(unitsToAdd) || unitsToAdd <= 0) {
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

        console.log(availableUnits + ' units available');
        console.log(unitsToAdd +' units to add');
        console.log(currentUnits +' current units');

        if (!this.#hasEnoughStock(availableUnits, unitsToAdd)) {
            return this.#sendError(res, 400, 'Not enough stock');
        }

        //Si hay más unidades agregar que stock del producto, se agregan solo las unidades disponibles

        const unitsToAddRestrained = unitsToAdd > availableUnits ? availableUnits : unitsToAdd;

        //Si existe el producto en el carrito, actualiza las unidades a comprar

        if (productInCart) {
            productInCart.quantity += unitsToAddRestrained;

            //si no existe en el carrito, lo agrega al producto con las unidades requeridas
        } else {
            cart.products.push({ productId, quantity: unitsToAddRestrained });
        }

       // product.stock -= unitsToAddRestrained;

        this.cartManagerAdapter.updateCart(cart);
       // this.productAdapter.updateProduct(product);

        res.send(cart);
    }


    async removeProductUnitsFromCart(req, res) {
        try {
            const cartId = parseInt(req.params.cid);
            const productId = parseInt(req.params.pid);
            let unitsToRemove = Number(req.params.units);

            if (isNaN(cartId) || isNaN(productId) || isNaN(unitsToRemove) || unitsToRemove <= 0) {
                return this.#sendError(res, 400, 'Invalid parameters');
            }

            const cart = await this.#_validateCartExists(res, cartId);
            // console.log(cart)
            if (!cart || typeof (cart) === 'undefined') {
                return this.#sendError(res, 404, 'Cart not found');
            }

            const product = await this.#_validateProductExists(res, productId);
            // console.log(product)
            if (!product || typeof (product) === 'undefined') {
                return this.#sendError(res, 404, 'Product not found');
            }

            // Validamos que la cantidad de unidades a quitar no sea mayor a la cantidad de unidades en el carrito
            const itemInCart = cart.products.find((item) => item.productId === productId);
            if (itemInCart) {
                if (unitsToRemove >= itemInCart.quantity) {
                    unitsToRemove = itemInCart.quantity;
                    // console.log(unitsToRemove + " units to remove")
                }
            }

            // console.log(product)
            // Se actualiza la cantidad del producto en el carrito
            const cartItemIndex = cart.products.findIndex((item) => item.productId === productId);
            if (cartItemIndex !== -1) {
                cart.products[cartItemIndex].quantity -= unitsToRemove;
                // console.log(cart.products[cartItemIndex].quantity)
                if (cart.products[cartItemIndex].quantity === 0) {
                    //Se borra directamente el producto del carrito
                    cart.products.splice(cartItemIndex, 1);
                    // console.log(cart)
                }
            }
            // console.log(cart)
            const updatedCart = await this.cartManagerAdapter.updateCart(cart);

            return res.status(200).json(updatedCart);
        } catch (error) {
            console.error(error);
            return this.#sendError(res, 500, 'Internal server error');
        }
    }



    async deleteCart(request, response) {
        const cartId = request.params.id;
        await this.cartManagerAdapter.deleteCart(cartId);
        response.status(204).send();
    }
}

export default CartManagerController;