import PersistenceManager from '../Data/PersistenceManager.js';
import DBStrategy from '../Data/DBStrategy.js';

class DBProductAdapter {
    static instance;

    constructor(uri) {
        if (DBProductAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.PersistenceManager = new PersistenceManager(new DBStrategy(uri));
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
            const products = await this.PersistenceManager.load();
            if (products.length === 0) {
                return [];
            }
            return products;
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    }

    async getProductById(idProduct) {
        try {
            const products = await this.PersistenceManager.load();
            if (products.length === 0) {
                return null;
            }
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
            const products = await this.PersistenceManager.load();
            const newProduct = { ...productToAdd };
            products.push(newProduct);
            await this.PersistenceManager.save(products);
            return newProduct;
        } catch (error) {
            throw new Error(`addProduct: ${error.message}`);
        }
    }

    async updateProduct(productToUpdate) {
        try {
            const products = await this.PersistenceManager.load();
            const { id } = productToUpdate;
            const productId = parseInt(id);

            if (isNaN(productId)) {
                throw new Error(`Invalid product ID: ${productIdToModify}`);
            }

            const productToUpdateRetrieved = products.find(
                (product) => product.id === productId
            );

            if (!productToUpdateRetrieved) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            const updatedProduct = {
                ...productToUpdateRetrieved,
                ...productToUpdate,
            };

            const updatedProducts = products.map((product) => {
                if (product.id === productId) {
                    return updatedProduct;
                }
                return product;
            });

            await this.PersistenceManager.save(updatedProducts);

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
            const products = await this.PersistenceManager.load();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error(`Product with ID: ${idToDelete} not found`);
            }
            products.splice(productIndex, 1);
            await this.PersistenceManager.save(products);
            return true;
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}

export default DBProductAdapter;
