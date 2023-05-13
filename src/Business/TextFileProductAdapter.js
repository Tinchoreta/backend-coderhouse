import PersistenceManager from '../Data/PersistenceManager.js';
import TextFileStrategy from '../Data/TextFileStrategy.js';
class TextFileProductAdapter {

    // Define una propiedad privada estática para almacenar 
    // la única instancia de la clase Patrón Singleton. Se usa static para
    // dejar en claro que es una propiedad de la clase y no de instancias de la misma.

    static instance;

    // Constructor privado para evitar la creación de nuevas instancias 
    //fuera de la clase

    constructor(pathToFile) {
        if (TextFileProductAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.PersistenceManager = new PersistenceManager(new TextFileStrategy(pathToFile));
        TextFileProductAdapter.instance = this;
    }

    // Método estático para obtener la instancia única de la clase TextFileProductAdapter
    static getInstance(pathToFile) {
        if (!TextFileProductAdapter.instance) {
            TextFileProductAdapter.instance = new TextFileProductAdapter(pathToFile);
        }
        return TextFileProductAdapter.instance;
    }

    // Métodos de la clase TextFileProductAdapter
    // que van a ser guardados en data.json

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
                throw new Error('Product not found');
            }
            const found = products.find((product) => product.id === parseInt(idProduct));
                                    
            return found || null;
        } catch (error) {
            throw new Error(`getProductById: ${error.message}`);
        }
    };

    async addProduct(productToAdd) {
        try {
            //Hago un destructuring de las propiedades del product a agregar
            const { title, description, price, thumbnail, stock } = productToAdd;
            const products = await this.PersistenceManager.load();
            const newProduct = { id: products.length + 1, title, description, price, thumbnail, stock };
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
            const {id} = productToUpdate;
            const productId = parseInt(id); 

            if (isNaN(productId)) {
                throw new Error(`Invalid product ID: ${productIdToModify}`);
            }

            //console.log(productId);
            const productToUpdateRetrieved = products.find((product) => product.id === productId);

            // console.log(productToUpdateRetrieved)

            if (!productToUpdate) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            // const stock = typeof productToUpdate.stock === 'number' ? productToUpdate.stock : productToUpdateRetrieved.stock;
            const updatedProduct = {
                id: productToUpdate.id,
                title: productToUpdate.title ?? productToUpdateRetrieved.title,
                description: productToUpdate.description ?? productToUpdateRetrieved.description,
                price: !isNaN(parseFloat(productToUpdate.price)) && isFinite(productToUpdate.price)
                    ? parseFloat(productToUpdate.price)
                    : productToUpdateRetrieved.price,
                thumbnail: productToUpdate.thumbnail ?? productToUpdateRetrieved.thumbnail,
                stock: !isNaN(parseInt(productToUpdate.stock)) && isFinite(productToUpdate.stock)
                    ? parseInt(productToUpdate.stock)
                    : productToUpdateRetrieved.stock
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
            //Se convierte el idToDelete a número y si no es un número tira un error
            const id = Number(idToDelete);
            if (isNaN(id)) {
                throw new Error(`Product ID "${idToDelete}" is not a valid number`);
            }
            //Se cargan los datos de los productos desde data.json
            const products = await this.PersistenceManager.load();
            //console.log(products)
            const productIndex = products.findIndex((product) => product.id === id);
            //console.log(productIndex)
            //Si no se encuentra el producto en el archivo data.json 
            //findIndex devolverá -1
            if (productIndex === -1) {
                throw new Error(`Product with ID: ${idToDelete} not found`);
            }
            //Con splice se quita el producto con ID: productIndex
            products.splice(productIndex, 1);

            //Y se vuelve a guardar en data.json los restantes productos.
            await this.PersistenceManager.save(products);
            return true;
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}

export default TextFileProductAdapter;