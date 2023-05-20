import TextFileProductAdapter from "../src/Business/TextFileProductAdapter.js";

const textFileProductAdapter = TextFileProductAdapter.getInstance(
  "./data/products.json"
);

async function validateProductExistence(req, res, next) {
  const productId = req.params.id;

  if (isNaN(productId)) {
    return res.status(400).json({ success: false, error: "Invalid product ID" });
  }
  
  const product = await textFileProductAdapter.getProductById(productId);
  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }
  next();
}

/*
Ejemplo de producto
"id": 2,
"title": "Producto 2",
"description": "Descripción del producto 2",
"price": 438,
"thumbnail": "https://ejemplo.com/imagen-producto-2.jpg",
"stock": 5 */

async function validateProductFields(req, res, next) {
  let { id, title, description, price, thumbnail, stock } = req.body;
  if (!id || !title || !price || !description || !thumbnail || stock<0) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  id = parseInt(id);
  price = parseFloat(price);
  stock = parseFloat(stock);

  if (isNaN(id) || isNaN(price) || isNaN(stock)) {
    return res
    .status(400)
    .json({ success: false, error: "Invalid product fields" });
  }
  
  const existingProduct = await textFileProductAdapter.getProductById(id);
  if (existingProduct) {
    return res
      .status(409)
      .json({ success: false, error: "Product with this ID already exists" });
  }

  req.body = { id, title, price, description, thumbnail, stock: stock || 0 };
  next();
}

export { validateProductExistence, validateProductFields };
