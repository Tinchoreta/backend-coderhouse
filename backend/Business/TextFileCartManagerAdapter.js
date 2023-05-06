import PersistenceManager from '../Data/PersistenceManager.js';
import TextFileStrategy from '../Data/TextFileStrategy.js';

class TextFileCartManagerAdapter {

    // Define una propiedad privada estática para almacenar 
    // la única instancia de la clase Patrón Singleton. Se usa static para
    // dejar en claro que es una propiedad de la clase y no de instancias de la misma.

    static instance;

    // Constructor privado para evitar la creación de nuevas instancias 
    //fuera de la clase

    constructor(pathToFile) {
        if (TextFileCartManagerAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.PersistenceManager = new PersistenceManager(new TextFileStrategy(pathToFile));
        TextFileCartManagerAdapter.instance = this;
    }

    // Método estático para obtener la instancia única de la clase TextFileCartManagerAdapter
    static getInstance(pathToFile) {
        if (!TextFileCartManagerAdapter.instance) {
            TextFileCartManagerAdapter.instance = new TextFileCartManagerAdapter(pathToFile);
        }
        return TextFileCartManagerAdapter.instance;
    }

    // Métodos de la clase TextFileCartManagerAdapter
    // que van a ser guardados en data.json

    async getCarts() {
        try {
            const cartList = await this.PersistenceManager.load();
            if (cartList.length === 0) {
                return [];
            }
            return cartList;
        } catch (error) {
            throw new Error(`getCart: ${error.message}`);
        }
    }


    async getCartById(cartId) {
        try {
            const cartsList = await this.PersistenceManager.load();
            if (cartsList.length === 0) {
                throw new Error('Not found');
            }
            const found = cartsList.find((cart) => cart.id === parseInt(cartId));
            if (!found) {
                throw new Error("Not found");
            }
            return found;
        } catch (error) {
            throw new Error(`getCartById: ${error.message}`);
        }
    };

    async addCart(cartToAdd) {
        try {
            const { products } = cartToAdd;
            const cart = await this.PersistenceManager.load();
            const newCart = { id: cart.length + 1, products };
            cart.push(newCart);
            await this.PersistenceManager.save(cart);
            return newCart.id;
        } catch (error) {
            throw new Error(`addCart: ${error.message}`);
        }
    }
}

export default TextFileCartManagerAdapter;