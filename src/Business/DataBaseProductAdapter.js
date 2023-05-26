import PersistenceManager from '../Data/PersistenceManager.js';
import DataBaseStrategy from '../Data/DataBaseStrategy.js';
import ProductModel from '../models/product.model.js';

class DataBaseProductAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseProductAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, ProductModel));
        DataBaseProductAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseProductAdapter.instance) {
            DataBaseProductAdapter.instance = new DataBaseProductAdapter(uri);
        }
        return DataBaseProductAdapter.instance;
    }

    async getProducts() {
        try {
            return await this.persistenceManager.load();
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    }

    async getProductById(idProduct) {
        try {
            return await this.persistenceManager.getOne({ id: parseInt(idProduct) });
        } catch (error) {
            throw new Error(`getProductById: ${error.message}`);
        }
    }

    async addProduct(productToAdd) {
        try {
            return await this.persistenceManager.addOne(productToAdd);
        } catch (error) {
            throw new Error(`addProduct: ${error.message}`);
        }
    }

    async updateProduct(productToUpdate) {
        try {
            const { id } = productToUpdate;
            const productId = parseInt(id);

            if (isNaN(productId)) {
                throw new Error(`Invalid product ID: ${productId}`);
            }

            return await this.persistenceManager.modifyOne({ id: productId }, productToUpdate);
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

            return await this.persistenceManager.deleteOne({ id });
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}

export default DataBaseProductAdapter;
