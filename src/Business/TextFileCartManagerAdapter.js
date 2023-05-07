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

    async createCart(cartToAdd=[]) {
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

    async updateCart(cartIdToModify, productIdToModify, productQuantity) {
        try {
            const carts = await this.PersistenceManager.load();
            const cartId = Number(cartIdToModify);

            if (isNaN(cartId)) {
                throw new Error(`Invalid cart ID: ${cartIdToModify}`);
            }

            const cartToModify = carts.find((cart) => cart.id === cartId);

            if (!cartToModify) {
                throw new Error(`Cart with ID ${cartId} not found`);
            }
            
            const updatedCart = {
                id: cartToModify.id,
                products: cartToModify.products.map((product) => {
                    if (product.id === productIdToModify) {
                        product.quantity = productQuantity;
                    }
                })
            };

            const updatedCarts = carts.map((cart) => {
                if (cart.id === cartId) {
                    return updatedCart;
                }
                return cart;
            });

            await this.PersistenceManager.save(updatedCarts);

            return updatedCart;
        } catch (error) {
            throw new Error(`updateCart: ${error.message}`);
        }
    }

    async deleteCart(idToDelete) {
        try {
            //Se convierte el idToDelete a número y si no es un número tira un error
            const id = Number(idToDelete);
            if (isNaN(id)) {
                throw new Error(`Cart ID "${idToDelete}" is not a valid number`);
            }
            //Se cargan los datos de los productos desde data.json
            const cartsLoaded = await this.PersistenceManager.load();
            console.log(cartsLoaded)
            const cartIndex = cartsLoaded.findIndex((product) => product.id === id);
            console.log(cartIndex)
            //Si no se encuentra el producto en el archivo data.json 
            //findIndex devolverá -1
            if (cartIndex === -1) {
                throw new Error(`Cart with ID: ${idToDelete} not found`);
            }
            //Con splice se quita el producto con ID: cartIndex
            cartsLoaded.splice(cartIndex, 1);
            //Y se vuelve a guardar en data.json los restantes productos.
            await this.PersistenceManager.save(cartsLoaded);
        } catch (error) {
            throw new Error(`deleteCart: ${error.message}`);
        }
    }

}

export default TextFileCartManagerAdapter;