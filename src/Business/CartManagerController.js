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

    constructor(cartManagerAdapter, producController) {
        this.cartManagerAdapter = cartManagerAdapter;
        this.producController = producController;
    }

    //Método privado, utilizado solo internamente y no puede accederse a él desde fuera de la clase
    
    #_validateCartExists(res, cid) {
        const cart = this.cartManager.getCartById(cid);
        if (!cart) {
            res.status(404).send('Cart not found');
            return false;
        }
        return cart;
    }

    //Método privado, utilizado solo internamente y no puede accederse a él desde fuera de la clase

    #_validateProductExists(res, pid) {
        const product = this.productController.getProductById(pid);
        if (!product) {
            res.status(404).send('Product not found');
            return false;
        }
        return product;
    }

    async createCart(request, response) {
        const productToAdd = request.body;
        const addedProduct = await this.cartManagerAdapter.addCart(productToAdd);
        response.status(201).json(addedProduct);
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
        const productId = request.params.id;
        const updatedProduct = request.body;
        const updatedItem = await this.cartManagerAdapter.updateCart(productId, updatedProduct);
        response.status(200).json(updatedItem);
    }

    addProductToCart(req, res) {
        const { cid, pid, units } = req.params;
        const cartId = Number(cid);
        const productId = Number(pid);
        const unitsToAdd = Number(units);

        if (isNaN(cartId) || isNaN(productId) || isNaN(unitsToAdd)) {
            res.status(400).send('Invalid parameter');
            return;
        }

        const cart = this._validateCartExists(res, cartId);
        if (!cart) {
            res.status(404).send('Cart not found');
            return;
        }

        const product = this._validateProductExists(res, productId);
        if (!product) {
            res.status(404).send('Product not found');
            return;
        }

        if (product.stock < unitsToAdd) {
            res.status(400).send('Not enough stock');
            return;
        }

        const productInCart = cart.products.find(p => p.productId === productId);
        const currentUnits = productInCart ? productInCart.quantity : 0;
        const availableUnits = product.stock - currentUnits;
        const unitsToAddClamped = Math.min(unitsToAdd, availableUnits);

        if (unitsToAddClamped === 0) {
            res.status(400).send('Not enough stock');
            return;
        }

        if (productInCart) {
            productInCart.quantity += unitsToAddClamped;
        } else {
            cart.products.push({ productId, quantity: unitsToAddClamped });
        }

        product.stock -= unitsToAddClamped;

        this.cartManager.saveCart(cart);
        this.productController.saveProduct(product);

        res.send(cart);
    }

    async removeCartItem(request, response) {
        const productId = request.params.id;
        await this.cartManagerAdapter.deleteCart(productId);
        response.status(204).send();
    }
}

export default CartManagerController;