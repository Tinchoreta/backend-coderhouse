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

    #_validateCartExists(res, cid) {
        const cart = this.cartManagerAdapter.getCartById(cid);
        if (!cart) {
            res.status(404).send('Cart not found');
            return false;
        }
        return cart;
    }

    //Método privado, utilizado solo internamente y no puede accederse a él desde fuera de la clase

    #_validateProductExists(res, pid) {
        const product = this.productAdapter.getProductById(pid);
        if (!product) {
            res.status(404).send('Product not found');
            return false;
        }
        return product;
    }

    #hasEnoughStock(product, unitsToAdd) {
        return product.stock >= unitsToAdd;
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

    addProductToCart(req, res) {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const unitsToAdd = Number(req.params.units);

        if (isNaN(cartId) || isNaN(productId) || isNaN(unitsToAdd) || unitsToAdd <= 0) {
            return this.sendError(res, 400, 'Invalid parameters');
        }

        const cart = this._validateCartExists(res, cartId);
        if (!cart) {
            return this.sendError(res, 404, 'Cart not found');
        }

        const product = this._validateProductExists(res, productId);
        if (!product) {
            return this.sendError(res, 404, 'Product not found');
        }

        if (!this.hasEnoughStock(product, unitsToAdd)) {
            return this.sendError(res, 400, 'Not enough stock');
        }

        const productInCart = cart.products.find(p => p.productId === productId);
        const currentUnits = productInCart ? productInCart.quantity : 0;
        const availableUnits = product.stock - currentUnits;

        //Si hay más unidades agregar que stock del producto, se agregan solo las unidades disponibles

        const unitsToAddRestrained = unitsToAdd > availableUnits ? availableUnits : unitsToAdd;

        //Si existe el producto en el carrito, actualiza las unidades a comprar

        if (productInCart) {
            productInCart.quantity += unitsToAddRestrained;

            //si no existe en el carrito, lo agrega al producto con las unidades requeridas
        } else {
            cart.products.push({ productId, quantity: unitsToAddRestrained });
        }

        product.stock -= unitsToAddRestrained;

        this.cartManagerAdapter.updateCart(cart);
        this.productAdapter.updatedProduct(product);

        res.send(cart);
    }


    async removeProductFromCart(req, res) {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        let unitsToRemove = Number(req.params.units);

        if (isNaN(cartId) || isNaN(productId) || isNaN(unitsToRemove) || unitsToRemove <= 0) {
            return this.sendError(res, 400, 'Invalid parameters');
        }

        const cart = this._validateCartExists(res, cartId);
        if (!cart) {
            return this.sendError(res, 404, 'Cart not found');
        }

        const product = this._validateProductExists(res, productId);
        if (!product) {
            return this.sendError(res, 404, 'Product not found');
        }

        // Validamos que la cantidad de unidades a quitar no sea mayor a la cantidad de unidades en el carrito
        const itemInCart = cart.products.find((item) => item.productId === productId);
        if (itemInCart) {
            if (unitsToRemove > itemInCart.quantity) {
                unitsToRemove = itemInCart.quantity;
            }
        }

        // Agregamos las unidades al stock del producto
        product.stock += unitsToRemove;

        this.productAdapter.updateProduct(product);

        const updatedCart = await this.cartManagerAdapter.removeProductFromCart({
            cartId: cartId,
            products: {
                productId: productId,
                quantity: 0
            }
        });

        return res.status(200).json(updatedCart);
    }


    async deleteCart(request, response) {
        const cartId = request.params.id;
        await this.cartManagerAdapter.deleteCart(cartId);
        response.status(204).send();
    }
}

export default CartManagerController;