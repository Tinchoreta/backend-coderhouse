import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import CustomError from "../../services/errors/CustomError.js";
import EnumeratedErrors from "../../services/errors/EnumeratedErrors.js";

// Función que devuelve el adaptador de la base de datos
async function getDatabaseProductAdapter() {
  const mongoDBURI = process.env.MONGO_DB_URI;
  return DataBaseProductAdapter.getInstance(mongoDBURI);
}

async function validateProductExistence(req, res, next) {
  const dataBaseProductAdapter = await getDatabaseProductAdapter();
  const productId = req.params.id;

  if (!productId) {
    throw new CustomError({
      name: EnumeratedErrors.INVALID_TYPE_ERROR,
      message: "Invalid product ID"
    });
  }

  const product = await dataBaseProductAdapter.getProductById(productId);
  if (!product) {
    throw new CustomError({
      name: EnumeratedErrors.PRODUCT_NOT_FOUND,
      message: "Product not found"
    });
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
    throw new CustomError({
      name: EnumeratedErrors.VALIDATION_ERROR,
      message: "Missing required fields"
    });
  }

  const parsedPrice = parseFloat(price);
  const parsedStock = stock !== undefined ? parseFloat(stock) : 0;

  if (isNaN(parsedPrice) || isNaN(parsedStock)) {
    throw new CustomError({
      name: EnumeratedErrors.VALIDATION_ERROR,
      message: "Invalid product fields"
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
  const { title, description } = req.body;

  const existingProduct = await dataBaseProductAdapter.getProductByTitleAndDescription(title, description);
  if (existingProduct?.length > 0) {
    throw new CustomError({
      name: EnumeratedErrors.VALIDATION_ERROR,
      message: "Duplicate product fields"
    });
  }

  next();
}

export { validateProductExistence, validateProductFields, checkDuplicateProductFields };
