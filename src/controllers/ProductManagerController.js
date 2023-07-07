class ProductManagerController {
  constructor(productManagerAdapter) {
    this.productManagerAdapter = productManagerAdapter;
  }

  async addProduct(request, response, next) {
    const productToAdd = request.body;
    if (!productToAdd || Object.keys(productToAdd).length === 0) {
      return response.status(400).json({
        success: false,
        error: 'Bad Request: No product data provided',
      });
    }
    if (!productToAdd.stock) {
      productToAdd.stock = 0;
    }

    try {
      const addedProduct = await this.productManagerAdapter.addProduct(productToAdd);
      response.status(201).json(addedProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      response.status(500).json({
        success: false,
        error: 'Internal Server Error',
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

      const result = await this.productManagerAdapter.getProducts(
        limit,
        page,
        sort,
        query
      );

      const formattedResponse = this.#formatProductsResponse(
        result,
        limit,
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

  #formatProductsResponse(result, limit, sort) {
    const formattedResponse = {
      status: "success",
      payload: result?.docs || [],
      prevPage: result?.prevPage || null,
      nextPage: result?.nextPage || null,
      pages: result?.pages?.map((page) => ({
        page: page.page,
        link: `/products?limit=${limit}&page=${page.page}&sort=${sort}`,
      })) || [],
      hasPrevPage: result?.hasPrevPage || false,
      hasNextPage: result?.hasNextPage || false,
      prevLink: result?.hasPrevPage
        ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}`
        : null,
      nextLink: result?.hasNextPage
        ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}`
        : null,
    };

    return formattedResponse;
  }

  #getQueryParams(request) {
    const { limit, page, sort, title } = request.query;
    const parsedLimit = limit === 'undefined' ? 6 : parseInt(limit, 10) || 6;
    const parsedPage = page === 'undefined' ? 1 : parseInt(page, 10) || 1;
    return { limit: parsedLimit, page: parsedPage, sort, title };
  }

  // #formatProductsResponse(products = [], totalCount, limit, page, sort) {
  //   const prevLink = page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}` : null;
  //   const nextLink =
  //     page < Math.ceil(totalCount / limit)
  //       ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}`
  //       : null;

  //   const pages = [];
  //   for (let i = 1; i <= Math.ceil(totalCount / limit); i++) {
  //     const link = `/products?limit=${limit}&page=${i}&sort=${sort}`;
  //     pages.push({ page: i, link });
  //   }

  //   return {
  //     status: "success",
  //     payload: products,
  //     prevPage: page > 1 ? page - 1 : null,
  //     nextPage: page < Math.ceil(totalCount / limit) ? page + 1 : null,
  //     pages: pages,
  //     hasPrevPage: page > 1,
  //     hasNextPage: page < Math.ceil(totalCount / limit),
  //     prevLink: prevLink ? prevLink : null,
  //     nextLink: nextLink ? nextLink : null,
  //   };
  // }


  async getProductById(request, response) {
    try {
      const productId = request.params.id;
      const productFound = await this.productManagerAdapter.getProductById(
        productId
      );
      if (productFound) {
        return response.status(200).json({
          success: true,
          product: productFound,
        });
      } else {
        return response.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        success: false,
        error: 'Internal Server Error',
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
    // Validate that the product properties are not empty strings
    if (updatedProduct.title === '') {
      return response.status(400).send({ message: 'Title cannot be empty' });
    }
    if (updatedProduct.description === '') {
      return response
        .status(400)
        .send({ message: 'Description cannot be empty' });
    }
    if (updatedProduct.price === '') {
      return response.status(400).send({ message: 'Price cannot be empty' });
    }
    if (updatedProduct.thumbnail === '') {
      return response
        .status(400)
        .send({ message: 'Thumbnail cannot be empty' });
    }
    if (updatedProduct.stock === '') {
      return response.status(400).send({ message: 'Stock cannot be empty' });
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
      const updatedItem = await this.productManagerAdapter.updateProduct(
        product
      );
      response.status(200).json(updatedItem);
    } catch (error) {
      console.error(
        `Error updating product with ID ${productId}: ${error.message}`
      );
      response.status(500).send({ message: 'Unable to update the product' });
    }
  }

  async removeProductItem(request, response) {
    const productId = request.params.id;

    //Validate that the product ID is valid
    if (!productId) {
      return response.status(400).send({ message: 'Invalid product ID' });
    }

    try {
      // Attempt to remove the product
      const isDeleted = await this.productManagerAdapter.deleteProduct(
        productId
      );
      // console.log(isDeleted + 'Controller delete');

      isDeleted //Boolean. Viene de deleteOne(id) que devuelve un objeto con propiedad deletedCount (indica cuántos registros se borraron).
        ? response
          .status(200)
          .send({
            success: true,
            message: 'Product deleted successfully',
          })
        : response
          .status(400)
          .send({
            success: false,
            message: 'Unable to remove the product',
          });
    } catch (error) {
      console.error(
        `Error removing product with ID ${productId}: ${error.message}`
      );
      response.status(500).send({ message: 'Unable to remove the product' });
    }
  }
}

export default ProductManagerController;
