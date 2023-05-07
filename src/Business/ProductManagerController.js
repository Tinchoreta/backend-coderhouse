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

        // Validate that the product ID is valid
        if (!productId || typeof productId !== 'string') {
            return response.status(400).send({ message: 'Invalid product ID' });
        }

        // Validate that the update data is valid
        if (!updatedProduct || typeof updatedProduct !== 'object') {
            return response.status(400).send({ message: 'Invalid update data' });
        }

        try {
            // Update the product
            const updatedItem = await this.productManagerAdapter.updateProduct(productId, updatedProduct);
            response.status(200).json(updatedItem);
        } catch (error) {
            console.error(`Error updating product with ID ${productId}: ${error.message}`);
            response.status(500).send({ message: 'Unable to update the product' });
        }
    }

    async removeProductItem(request, response) {
        const productId = request.params.id;

        // Validate that the product ID is valid
        if (!productId || typeof productId !== 'string') {
            return response.status(400).send({ message: 'Invalid product ID' });
        }

        try {
            // Attempt to remove the product
            await this.productManagerAdapter.deleteProduct(productId);
            response.status(204).send();
        } catch (error) {
            console.error(`Error removing product with ID ${productId}: ${error.message}`);
            response.status(500).send({ message: 'Unable to remove the product' });
        }
    }

}

export default ProductManagerController;