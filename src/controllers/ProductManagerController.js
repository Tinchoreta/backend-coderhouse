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

  async addProduct(request, response, next) {
    const productToAdd = request.body;
    if (!productToAdd || Object.keys(productToAdd).length === 0) {
      return response.status(400).json({
        success: false,
        error: "Bad Request: No product data provided",
      });
    }
    if (!productToAdd.stock) {
      productToAdd.stock = 0;
    }
    // console.log(JSON.stringify(productToAdd) + " added");
    try {
      const addedProduct = await this.productManagerAdapter.addProduct(
        productToAdd
      );
      response.status(201).json(addedProduct);
    } catch (error) {
      console.error("Error adding product:", error);
      response.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }

  async getProducts(request, response) {
    try {
      const { limit, page, sort, title } = this.#getQueryParams(request);

      const query = {};

      if (title) {
        query.title = { $regex: new RegExp(`^${title}`, "i") };
      }

      const result = await this.productManagerAdapter.getProducts(limit, page, sort, query);

      const adaptedProducts = result.products;

      const formattedResponse = this.#formatProductsResponse(
        adaptedProducts,
        result.totalCount,
        limit,
        page,
        sort
      );

      return response.status(200).json(formattedResponse);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        status: "error",
        error: "Internal Server Error",
      });
    }
  }

  #getQueryParams(request) {
    const { limit, page, sort, title } = request.query;
    const parsedLimit = limit === "undefined" ? 6 : parseInt(limit, 10) || 6;
    const parsedPage = page === "undefined" ? 1 : parseInt(page, 10) || 1;
    return { limit: parsedLimit, page: parsedPage, sort, title };
  }




  #formatProductsResponse(products, totalCount, limit, page, sort) {
    const prevLink = page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}` : null;
    const nextLink =
      page < Math.ceil(totalCount / limit)
        ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}`
        : null;

    const pages = [];
    for (let i = 1; i <= Math.ceil(totalCount / limit); i++) {
      const link = `/products?limit=${limit}&page=${i}&sort=${sort}`;
      pages.push({ page: i, link });
    }

    return {
      status: "success",
      payload: products,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(totalCount / limit) ? page + 1 : null,
      pages: pages,
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / limit),
      prevLink: prevLink ? prevLink : null,
      nextLink: nextLink ? nextLink : null,
    };
  }

  async getProductById(request, response) {
    try {
      const productId = request.params.id;
      const productFound = await this.productManagerAdapter.getProductById(productId);
      if (productFound) {
        return response.status(200).json({
          success: true,
          product: productFound,
        });
      } else {
        return response.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }

  async updateProductItem(request, response) {
    const productId = request.params.id;
    const updatedProduct = request.body;

    // Validate that the product ID is valid
    if (!productId || typeof productId !== "string") {
      return response.status(400).send({ message: "Invalid product ID" });
    }

    // Validate that the update data is valid
    if (!updatedProduct || typeof updatedProduct !== "object") {
      return response.status(400).send({ message: "Invalid update data" });
    }
    // Validate that the product properties are not empty strings
    if (updatedProduct.title === "") {
      return response.status(400).send({ message: "Title cannot be empty" });
    }
    if (updatedProduct.description === "") {
      return response.status(400).send({ message: "Description cannot be empty" });
    }
    if (updatedProduct.price === "") {
      return response.status(400).send({ message: "Price cannot be empty" });
    }
    if (updatedProduct.thumbnail === "") {
      return response.status(400).send({ message: "Thumbnail cannot be empty" });
    }
    if (updatedProduct.stock === "") {
      return response.status(400).send({ message: "Stock cannot be empty" });
    }

    try {
      // Update the product
      const product = {
        id: productId,
        title: updatedProduct.title,
        description: updatedProduct.description,
        price: updatedProduct.price,
        thumbnail: updatedProduct.thumbnail,
        stock: updatedProduct.stock,
      };
      const updatedItem = await this.productManagerAdapter.updateProduct(product);
      response.status(200).json(updatedItem);
    } catch (error) {
      console.error(
        `Error updating product with ID ${productId}: ${error.message}`
      );
      response.status(500).send({ message: "Unable to update the product" });
    }
  }

  async removeProductItem(request, response) {
    const productId = request.params.id;

    // Validate that the product ID is valid
    if (!productId) {
      return response.status(400).send({ message: "Invalid product ID" });
    }

    try {
      // Attempt to remove the product
      const isDeleted = await this.productManagerAdapter.deleteProduct(
        productId
      );
      // console.log(isDeleted + "Controller delete");

      isDeleted  //Boolean. Viene de deleteOne(id) que devuelve un objeto con propiedad deletedCount (indica cuántos registros se borraron).
        ? response
          .status(200)
          .send(
            {
              success: true,
              message: "Product deleted successfully",
            })
        : response
          .status(400)
          .send(
            {
              success: false,
              message: "Unable to remove the product"
            });
    } catch (error) {
      console.error(
        `Error removing product with ID ${productId}: ${error.message}`
      );
      response.status(500).send({ message: "Unable to remove the product" });
    }
  }
}

export default ProductManagerController;
