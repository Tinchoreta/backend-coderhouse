
/* 

Definir una clase que se llame ProductManager, 
la cuál tendrá un arreglo de Productos que iniciará vacíos. 

*/

import Product from './Product.js';

class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  addProduct({ title, description, price, thumbnail, stock }) {
    if (!title || title.length === 0) {
      throw new Error("El campo título es obligatorio");
    }
    if (!description || description.length === 0) {
      throw new Error("El campo descripción es obligatorio");
    }
    if (!price || price <= 0) {
      throw new Error(
        "El campo precio es obligatorio y debe ser mayor que cero"
      );
    }
    if (!thumbnail || thumbnail.length === 0) {
      throw new Error("El campo imagen es obligatorio");
    }
    if (stock < 0) {
      throw new Error("El campo stock no puede ser menor que cero");
    }

    //si el stock no se especifica, por defecto será cero.

    stock = stock ?? 0;

    const newId = this.getLastId() + 1;
    const newProduct = new Product(
      newId,
      title,
      description,
      price,
      thumbnail,
      stock
    );
    this.products.push(newProduct);
    return newId;
  }

  getLastId = () => {
    const lastIndex = this.products.length - 1;
    return lastIndex < 0 ? 0 : this.products[lastIndex].id;
  };

  getProductById(idProduct) {
    const found = this.products.find(
      (product) => product.id === parseInt(idProduct)
    );
    if (!found) {
      return null;
    }
    return found;
  }

  updateProduct(id, dataToUpdate) {
    const product = this.getProductById(id);
    if (!product) {
      throw new Error(`Producto con ID: ${id} no encontrado`);
    }
    const { title, description, price, thumbnail, stock } = dataToUpdate;
    //en caso de que no se modifiquen todas las propiedades, se deja el valor que tenían.
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.price = parseFloat(price) ?? product.price;
    product.thumbnail = thumbnail ?? product.thumbnail;
    product.stock = parseInt(stock) ?? product.stock;
    return product;
  }

  deleteProduct(idProduct) {
    const productIndex = this.products.findIndex(
      (product) => product.id === parseInt(idProduct)
    );
    if (productIndex === -1) {
      throw new Error(`Producto con ID: ${idProduct} no encontrado`);
    }
    this.products.splice(productIndex, 1);
  }

  calculateTotalPrice() {
    try {
      let totalPrice = 0;
      for (const product of this.products) {
        totalPrice += product.price * product.quantity;
      }
      return totalPrice;
    } catch (error) {
      throw new Error(`calculateTotalPrice: ${error.message}`);
    }
  }

  calculateCheapestPrice() {
    try {
      let cheapestPrice = Infinity;
      for (let i = 0; i < this.products.length; i++) {
        const productData = this.products[i];
        if (productData.price < cheapestPrice) {
          cheapestPrice = productData.price;
        }
      }
      return cheapestPrice;
    } catch (error) {
      throw new Error(`calculateCheapestPrice: ${error.message}`);
    }
  }

  calculateMostExpensivePrice() {
    try {
      let mostExpensivePrice = 0;
      for (let i = 0; i < this.products.length; i++) {
        const productData = this.products[i];
        if (productData.price > mostExpensivePrice) {
          mostExpensivePrice = productData.price;
        }
      }
      return mostExpensivePrice;
    } catch (error) {
      throw new Error(`calculateMostExpensivePrice: ${error.message}`);
    }
  }
}

export default ProductManager;