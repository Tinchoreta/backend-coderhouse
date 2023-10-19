import axios from 'axios';

class ProductViewController {
  constructor() { }

  renderAddProductForm(req, res) {
    try {
      return res.render("addProduct", {
        title: "Product add Form",
        script: "addProduct.js",
        css: "addProduct.css",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }

  // Método para construir la URL con parámetros opcionales
  #buildProductsUrl(baseURL, queryParams) {
    const { limit, page, sort, title } = queryParams;

    let url = baseURL;

    if (limit !== undefined) {
      url += `?limit=${limit}`;
    }
    if (page !== undefined) {
      url += `${limit !== undefined ? '&' : '?'}page=${page}`;
    }
    if (sort !== undefined) {
      url += `${(limit !== undefined || page !== undefined) ? '&' : '?'}sort=${sort}`;
    }
    if (title !== undefined) {
      url += `${(limit !== undefined || page !== undefined || sort !== undefined) ? '&' : '?'}title=${title}`;
    }

    return url;
  }
  
  async renderProductsForm(req, res) {
    try {
      const { limit, page, sort, title } = req.query;
      const baseURL = 'http://localhost:8080/api/products';
      const url = this.#buildProductsUrl(baseURL, { limit, page, sort, title });

      const response = await axios.get(url);
      const products = response.data.payload;
      const cartManager = req.cartManager;
      const { totalPages, prevLink, nextLink, pages } = response.data;

      const adaptedPages = pages.map((pageData) => ({
        page: pageData.page.toString(), // Convertir a cadena de texto
        link: pageData.link,
      }));

      return res.render("products", {
        title: "Products",
        script: "products.js",
        css: "products.css",
        products: products,
        cartManager: cartManager,
        totalPages: totalPages,
        prevLink: prevLink,
        nextLink: nextLink,
        pages: adaptedPages
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }


  async renderProductDetailsForm(req, res, productId) {
    try {
      // console.log(`http://localhost:8080/api/products/${productId}`);
      const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
      const productDetails = response.data.payload;
      const cartManager = req.cartManager;

      return res.render("productDetails", {
        title: "Product Details",
        script: "productDetails.js",
        css: "productDetails.css",
        productDetails: productDetails,
        cartManager: cartManager
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }


  renderAddProductResponse(req, res, success, message) {
    const data = {
      success: true,
      message: message,
      css: "addProduct.css",
    };
    res.render("addProduct", data);
  }
}

export default ProductViewController;
