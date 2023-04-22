
/* 

Definir una clase que se llame ProductManager, 
la cuál tendrá un arreglo de Productos que iniciará vacíos. 

*/

const Product = require('./Product');

class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    };

    addProduct ({ title, description, price, thumbnail, stock }) {
        if (!title || title.length === 0) {
            throw new Error('El campo título es obligatorio');
        }
        if (!description || description.length === 0) {
            throw new Error('El campo descripción es obligatorio');
        }
        if (!price || price <= 0) {
            throw new Error('El campo precio es obligatorio y debe ser mayor que cero');
        }
        if (!thumbnail || thumbnail.length === 0) {
            throw new Error('El campo imagen es obligatorio');
        }
        if (stock < 0) {
            throw new Error('El campo stock no puede ser menor que cero');
        }
        
        //si el stock no se especifica, por defecto será cero.

        stock = stock ?? 0;
    
        const newId = this.getLastId() + 1;
        const newProduct = new Product(newId, title, description, price, thumbnail, stock);
        this.products.push(newProduct);
        return newId;
    };

    getLastId = () => {
        const lastIndex = this.products.length - 1;
        return lastIndex < 0 ? 0 : this.products[lastIndex].id;
    };

    getProductById (idProduct) {
        const found = this.products.find((product) => product.id === parseInt(idProduct));
        if (!found) {
            throw new Error("Producto no encontrado");
        }
        return found;
    };

    editProduct(id, { title, description, price, thumbnail, stock }) {
        const product = this.getProductById(id);
        if (!product) {
            throw new Error(`Producto con ID: ${id} no encontrado`);
        }
        //en caso de que no se modifiquen todas las propiedades, se deja el valor que tenían.
        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.thumbnail = thumbnail ?? product.thumbnail;
        product.stock = stock ?? product.stock;
        return product;
    }
    deleteProduct (idProduct) {
        const productIndex = this.products.findIndex((product) => product.id === parseInt(idProduct));
        if (productIndex === -1) {
            throw new Error(`Producto con ID: ${idProduct} no encontrado`);
        }
        this.products.splice(productIndex, 1);
    };
}

module.exports = ProductManager;