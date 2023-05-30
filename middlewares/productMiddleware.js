import DataBaseProductAdapter from "../src/Business/DataBaseProductAdapter.js";

// Función que devuelve el adaptador de la base de datos
function getDatabaseProductAdapter() {
  const mongoDBURI = process.env.MONGO_DB_URI;
  return DataBaseProductAdapter.getInstance(mongoDBURI);
}

async function validateProductExistence(req, res, next) {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ success: false, error: "Invalid product ID" });
  }

  const dataBaseProductAdapter = getDatabaseProductAdapter();

  const product = await dataBaseProductAdapter.getProductById(productId);
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
  let {title, description, price, thumbnail, stock } = req.body;
  if (!title || !price || !description || !thumbnail || stock < 0) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  price = parseFloat(price);
  stock = parseFloat(stock);

  if ( isNaN(price) || isNaN(stock)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid product fields" });
  }

  req.body = { title, price, description, thumbnail, stock: stock || 0 };
  next();
}

export { validateProductExistence, validateProductFields };
