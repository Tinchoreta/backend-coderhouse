import PersistenceManager from '../Data/PersistenceManager.js';
import DBStrategy from '../Data/DBStrategy.js';
import ProductModel from '../models/product.model.js';

class DBProductAdapter {
    static instance;

    constructor(uri) {
        if (DBProductAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DBStrategy(uri, ProductModel));
        DBProductAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DBProductAdapter.instance) {
            DBProductAdapter.instance = new DBProductAdapter(uri);
        }
        return DBProductAdapter.instance;
    }

    async getProducts() {
        try {
            const products = await this.persistenceManager.load('products');
            return products || [];
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    }

    async getProductById(idProduct) {
        try {
            const products = await this.persistenceManager.load('products');
            const found = products.find(
                (product) => product.id === parseInt(idProduct)
            );
            return found || null;
        } catch (error) {
            throw new Error(`getProductById: ${error.message}`);
        }
    }

    async addProduct(productToAdd) {
        try {
            const products = await this.persistenceManager.load('products');
            const newProduct = { ...productToAdd };
            products.push(newProduct);
            await this.persistenceManager.save('products', products);
            return newProduct;
        } catch (error) {
            throw new Error(`addProduct: ${error.message}`);
        }
    }

    async updateProduct(productToUpdate) {
        try {
            const products = await this.persistenceManager.load('products');
            const { id } = productToUpdate;
            const productId = parseInt(id);

            if (isNaN(productId)) {
                throw new Error(`Invalid product ID: ${productId}`);
            }

            const productIndex = products.findIndex(
                (product) => product.id === productId
            );

            if (productIndex === -1) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            const updatedProduct = {
                ...products[productIndex],
                ...productToUpdate,
            };

            products[productIndex] = updatedProduct;

            await this.persistenceManager.save('products', products);

            return updatedProduct;
        } catch (error) {
            throw new Error(`updateProduct: ${error.message}`);
        }
    }

    async deleteProduct(idToDelete) {
        try {
            const id = Number(idToDelete);
            if (isNaN(id)) {
                throw new Error(`Product ID "${idToDelete}" is not a valid number`);
            }

            const products = await this.persistenceManager.load('products');
            const productIndex = products.findIndex((product) => product.id === id);

            if (productIndex === -1) {
                throw new Error(`Product with ID: ${idToDelete} not found`);
            }

            products.splice(productIndex, 1);

            await this.persistenceManager.save('products', products);

            return true;
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}

export default DBProductAdapter;
