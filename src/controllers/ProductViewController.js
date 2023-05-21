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

  async renderProductsForm(req, res) {
    try {
      const response = await fetch("http://localhost:8080/api/products/");
      const responseJson = await response.json();
      const products = responseJson.response;

      return res.render("products", {
        title: "Products",
        script: "products.js",
        css: "products.css",
        products: products
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
      const response = await fetch(`http://localhost:8080/api/products/${productId}`);
      const responseJson = await response.json();
      const productDetails = responseJson.response;

      return res.render("productDetails", {
        title: "Product Details",
        script: "productDetails.js",
        css: "productDetails.css",
        productDetails: productDetails
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
      css: "product.css",
    };
    res.render("addProduct", data);
  }
}

export default ProductViewController;
