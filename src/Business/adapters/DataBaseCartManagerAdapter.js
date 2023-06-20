import PersistenceManager from '../../persistence/PersistenceManager.js';
import DataBaseStrategy from '../../persistence/DataBaseStrategy.js';
import CartModel from '../../models/cart.model.js';
import ProductModel from '../../models/product.model.js';

class DataBaseCartManagerAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseCartManagerAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        // console.log(uri);
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, CartModel));
        DataBaseCartManagerAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseCartManagerAdapter.instance) {
            // console.log(uri + " en getInstance");
            DataBaseCartManagerAdapter.instance = new DataBaseCartManagerAdapter(uri);
        }
        return DataBaseCartManagerAdapter.instance;
    }

    async getCarts() {
        try {
            const carts = await this.persistenceManager.load();
            return carts;
        } catch (error) {
            throw new Error(`getCarts: ${error.message}`);
        }
    }

    async getProductsIds(cartId) {
        try {
            const cart = await this.persistenceManager.getOne({ _id: cartId });
            return cart ? cart.products.map((product) => product.productId) : [];
        } catch (error) {
            throw new Error(`getProductsIds: ${error.message}`);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await this.persistenceManager.getOne({ _id: cartId });
            return cart || null;
        } catch (error) {
            throw new Error(`getCartById: ${error.message}`);
        }
    };

    async createCart() {
        try {
            const cart = { products: [] };
            const createdCart = await this.persistenceManager.addOne(cart);
            return createdCart._id;
        } catch (error) {
            throw new Error(`createCart: ${error.message}`);
        }
    }

    async updateCart(cartToUpdate) {
        try {
            const { _id, products } = cartToUpdate;

            const updatedCart = await this.persistenceManager.modifyOne(
                { _id },
                { products }
            );

            return updatedCart;
        } catch (error) {
            throw new Error(`updateCart: ${error.message}`);
        }
    }


    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.persistenceManager.getOne({ _id: cartId });
            if (!cart) {
                throw new Error(`Cart with ID: ${cartId} not found`);
            }

            const updatedProducts = cart.products.filter((product) => product.productId !== productId);

            const updatedCart = await this.persistenceManager.modifyOne(
                { _id: cart.id },
                { products: updatedProducts }
            );

            if (!updatedCart) {
                throw new Error(`Product with ID ${productId} not found in cart ${cartId}`);
            }

            return updatedCart;
        } catch (error) {
            throw new Error(`removeProductFromCart: ${error.message}`);
        }
    }

    async deleteCart(idToDelete) {
        try {
            const id = idToDelete;
            if (!id) {
                throw new Error(`Cart ID "${idToDelete}" is not a valid number`);
            }

            const isDeleted = await this.persistenceManager.deleteOne({ _id });

            if (!isDeleted) {
                throw new Error(`Cart with ID: ${idToDelete} could not be deleted`);
            }
        } catch (error) {
            throw new Error(`deleteCart: ${error.message}`);
        }
    }

    async populateProducts(carts) {
        try {
            const populatedCarts = await this.persistenceManager.populateMany(carts, 'products' , ProductModel);
            return populatedCarts;
        } catch (error) {
            throw new Error(`populateProducts: ${error.message}`);
        }
    }



}

export default DataBaseCartManagerAdapter;
