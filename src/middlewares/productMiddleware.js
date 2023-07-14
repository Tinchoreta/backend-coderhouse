import DataBaseProductAdapter from "../Business/adapters/DataBaseProductAdapter.js";

// Función que devuelve el adaptador de la base de datos
async function getDatabaseProductAdapter() {
  const mongoDBURI = process.env.MONGO_DB_URI;
  return DataBaseProductAdapter.getInstance(mongoDBURI);
}

async function validateProductExistence(req, res, next) {
  const dataBaseProductAdapter = await getDatabaseProductAdapter();
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ success: false, error: "Invalid product ID" });
  }
  
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
"stock": 5 
"category": "Cameras",
"created_at": "
*/

async function validateProductFields(req, res, next) {
  const { title, description, price, thumbnail, stock, category, created_at } = req.body;

  if (!title || !price || !description || !thumbnail || !category) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  const parsedPrice = parseFloat(price);
  const parsedStock = stock !== undefined ? parseFloat(stock) : 0;

  if (isNaN(parsedPrice) || isNaN(parsedStock)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid product fields'
    });
  }

  req.body = {
    title,
    price: parsedPrice,
    description,
    thumbnail,
    stock: parsedStock,
    category: category,
    created_at: created_at,
  };

  next();
}

async function checkDuplicateProductFields(dataBaseProductAdapter, req, res, next) {
  // const dataBaseProductAdapter = await getDatabaseProductAdapter();
  const { title, description } = req.body;

  // Check if title and description already exist in the database
  const existingProduct = await dataBaseProductAdapter.getProductByTitleAndDescription(title, description);
  if (existingProduct?.length > 0) {
    return res.status(400).json({ success: false, error: "Duplicate product fields" });
  }

  next();
}

export { validateProductExistence, validateProductFields, checkDuplicateProductFields};
