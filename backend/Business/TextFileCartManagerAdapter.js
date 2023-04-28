import PersistenceManager from '../Data/PersistenceManager';
import TextFileStrategy  from '../Data/TextFileStrategy';

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

    async getCart() {
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


    // async updateProduct(productId, productData) {
    //     const products = await this.PersistenceManager.load();
    //     const productToUpdate = products.find((product) => product.id === productId);
    //     if (!productToUpdate) {
    //         throw new Error(`Producto con ID: ${productId} no encontrado`);
    //     }
    //     //Se actualizan los datos del producto con ID: productId, con las propiedades
    //     //enviadas por parámetro en productData
    //     //se utiliza ?? para asegurar la integridad de los datos a modificar
    //     //si vienen con null o undefined, simplemente no se modifican
    //     //y queda el valor original que traía desde el archivo.
    //     const stock = typeof productData.stock === 'number' ? productData.stock : productToUpdate.stock;
    //     const updatedProduct = {
    //         id: productToUpdate.id,
    //         title: productData.title ?? productToUpdate.title,
    //         description: productData.description ?? productToUpdate.description,
    //         price: !isNaN(parseFloat(productData.price)) && isFinite(productData.price) 
    //         ? parseFloat(productData.price)
    //         : productToUpdate.price,
    //         thumbnail: productData.thumbnail ?? productToUpdate.thumbnail,
    //         stock: !isNaN(parseInt(productData.stock)) && isFinite(productData.stock) 
    //         ? parseInt(productData.stock)
    //         : productToUpdate.stock
    //     };

    //     // Se crea una nueva lista de productos con el producto actualizado. 
    //     //Esto se hace para asegurarse de que se mantenga la integridad de los datos.

    //     const updatedProducts = products.map((product) => {
    //         if (product.id === productId) {
    //             return updatedProduct;
    //         }
    //         return product;
    //     });
    //     //Se almacena todo el array de productos con el producto actualizado en data.json

    //     await this.PersistenceManager.save(updatedProducts);
    //     return updatedProduct;
    // }

    // async deleteProduct(idToDelete) {
    //     try {
    //         //Se cargan los datos de los productos desde data.json
    //         const products = await this.PersistenceManager.load();
    //         const productIndex = products.findIndex((product) => product.id === idToDelete);
    //         //Si no se encuentra el producto en el archivo data.json 
    //         //findIndex devolverá -1
    //         if (productIndex === -1) {
    //             throw new Error(`Producto con ID: ${idToDelete} no encontrado`);
    //         }
    //         //Con splice se quita el producto con ID: productIndex
    //         products.splice(productIndex, 1);

    //         //Y se vuelve a guardar en data.json los restantes productos.
    //         await this.PersistenceManager.save(products);
    //     } catch (error) {
    //         throw new Error(`deleteProduct: ${error.message}`);
    //     }
    // }
}

export default TextFileCartManagerAdapter;