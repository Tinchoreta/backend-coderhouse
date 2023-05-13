import TextFileProductAdapter from "../src/Business/TextFileProductAdapter";
import ProductManagerController from "../src/Business/ProductManagerController";

const textFileProductAdapter = TextFileProductAdapter.getInstance("./data/products.json");
const productController = new ProductManagerController(textFileProductAdapter);

function validateProductExistence(req, res, next) {
    const productId = req.params.id;
    const product = textFileProductAdapter.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    next();
  }

