class ProductViewController {
  constructor() {}

  renderAddProductForm(req, res) {
    try {
      return res.render("addProduct", {
        title: "Product Add",
        script: "product.js",
        css: "product.css",
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
      success: success,
      message: message,
      css: "product.css",
    };
    res.render("addProduct", data);
  }
}

export default ProductViewController;
