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

    async calculateCartPrice(cartId) {
        //TODO: calculate
        // try {
        //     const cartToCalculatePrice = await this.getCartById(cartId);
        //     if (cartToCalculatePrice.length === 0) {
        //         return 0;
        //     }
        //     let totalPrice = 0;
        //     cartToCalculatePrice.products.forEach((product) => {
        //         totalPrice += product.price;
        //     });
        //     return totalPrice;
        // } catch (error) {
        //     throw new Error(`calculateCartPrice: ${error.message}`);
        // }
    }
    
    

    async calculateProductsQuantityOnCart(cartId){
        try {
            const cartToCalculatePrice = await this.getCartById(cartId);
            if (cartToCalculatePrice.length === 0) {
                return 0;
            }
            let totalQuantity = 0;
            cartToCalculatePrice.products.forEach((product) => {
                totalQuantity += product.quantity;
            });
            return totalQuantity;
        } catch (error) {
            throw new Error(`calculateProductsQuantityOnCart: ${error.message}`);
        }
    }

    async getCartById(cartId) {
        try {
            const cartsList = await this.PersistenceManager.load();
            if (cartsList.length === 0) {
                return null;
            }
            const found = cartsList.find((cart) => cart.id === parseInt(cartId));
            if (!found) {
                return null;
            }
            return found;
        } catch (error) {
            throw new Error(`getCartById: ${error.message}`);
        }
    };

    async createCart() {
        try {
            const cart = await this.PersistenceManager.load();
            const newCart = { id: cart.length + 1, products: [] };
            cart.push(newCart);
            await this.PersistenceManager.save(cart);
            return newCart.id;
        } catch (error) {
            throw new Error(`addCart: ${error.message}`);
        }
    }

    async updateCart(cartToUpdate) {
        try {
            const { id, products } = cartToUpdate;
            const cartId = parseInt(id);

            const cartsFromPersistence = await this.PersistenceManager.load();
            const cartToUpdateIndex = cartsFromPersistence.findIndex((cart) => cart.id === cartId);

            if (cartToUpdateIndex < 0) {
                throw new Error(`Cart with ID ${cartId} not found`);
            }

            products.forEach((productToUpdate) => {
                const productIndexToUpdate = cartsFromPersistence[cartToUpdateIndex].products.findIndex((p) => p.productId === productToUpdate.productId);

                if (productIndexToUpdate !== -1) {
                    cartsFromPersistence[cartToUpdateIndex].products[productIndexToUpdate].quantity = productToUpdate.quantity;
                } else {
                    cartsFromPersistence[cartToUpdateIndex].products.push(productToUpdate);
                }
            });

            await this.PersistenceManager.save(cartsFromPersistence);

            return cartsFromPersistence[cartToUpdateIndex];
        } catch (error) {
            throw new Error(`updateCart: ${error.message}`);
        }
    }



    async removeProductFromCart(cartId, productId) {
        try {
            if (isNaN(cartId) || isNaN(productId)) {
                throw new Error('Invalid parameters');
            }

            const cartsFromPersistence = await this.cartManagerAdapter.getCarts();
            const cartFound = cartsFromPersistence.find((cart) => cart.id === parseInt(cartId));
            if (!cartFound) {
                throw new Error(`Cart with ID: ${cartId} not found`);
            }

            const product = cartFound.products.find((product) => product.productId === parseInt(productId));
            if (!product) {
                throw new Error(`Product with ID: ${productId} not found in cart with ID: ${cartId}`);
            }

            cartFound.products = cartFound.products.filter((product) => product.productId !== parseInt(productId));
            await this.cartManagerAdapter.updateCart({
                id: cartId,
                products: cartFound.products
            });

            return cartFound;
        } catch (error) {
            console.error(error);
            throw new Error("Error removing product from cart.");
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