class ProductManagerController {

    /*
        LISTA DE CÓDIGOS DE ESTADO HTTP
        200 “OK” – La respuesta para una solicitud HTTP exitosa. El resultado dependerá del tipo de solicitud.
        201 “Created” – La solicitud se cumplió y el servidor creó un nuevo recurso.
        204 “No Content” – El servidor cumplió con la solicitud pero no devolverá ningún contenido.
        400 “Bad Request” – El servidor no puede devolver una respuesta válida debido a un error del lado del cliente. Las causas comunes son URL solicitadas con formato incorrecto, enrutamiento de solicitud engañoso, tamaño de archivo grande, etc.
        404 “Not found” – Este es el error más frecuente que ven los usuarios en línea. Significa que el servidor no puede encontrar el recurso solicitado. Por lo general, la causa es que la URL a la que intentas acceder no existe.
        500 “Internal Server Error” – Es un error genérico que indica que el servidor encontró una condición inesperada y no puede cumplir con la solicitud. El servidor te dice que hay algo mal, pero no está seguro de cuál es el problema.
    */

    constructor(productManagerAdapter) {
        this.productManagerAdapter = productManagerAdapter;
    }

    async addProduct(request, response) {
        const productToAdd = request.body;
        if (!productToAdd || Object.keys(productToAdd).length === 0) {
            return response.status(400).json({
                success: false,
                error: 'Bad Request: No product data provided'
            });
        }
        console.log(JSON.stringify(productToAdd));

        try {
            const addedProduct = await this.productManagerAdapter.addProduct(productToAdd);
            response.status(201).json(addedProduct);

        } catch (error) {

            console.error('Error adding product:', error);
            response.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }

    }

    async getProducts(request, response) {
        try {
            const products = await this.productManagerAdapter.getProducts();
            const limit = parseInt(request.query.limit);

            if (isNaN(limit)) {
                return response.status(200).json({
                    success: true,
                    response: products
                });
            } else {
                const limitedProducts = products.slice(0, limit);
                return response.status(200).json({
                    success: true,
                    response: limitedProducts
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

    async getProductById(request, response) {
        try {
            const productId = request.params.id;
            const productFound = await this.productManagerAdapter.getProductById(productId);
            if (productFound) {
                return response.status(200).json({
                    success: true,
                    product: productFound
                });
            } else {
                return response.status(404).json({
                    success: false,
                    error: 'Product not found'
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

    async updateProductItem(request, response) {
        const productId = request.params.id;
        const updatedProduct = request.body;
        const updatedItem = await this.productManagerAdapter.updateProduct(productId, updatedProduct);
        response.status(200).json(updatedItem);
    }

    async removeProductItem(request, response) {
        const productId = request.params.id;
        await this.productManagerAdapter.removeProduct(productId);
        response.status(204).send();
    }
}

export default ProductManagerController;