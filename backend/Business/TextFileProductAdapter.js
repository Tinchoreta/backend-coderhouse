const PersistenceManager = require('../Data/PersistenceManager');
const TextFileStrategy = require('../Data/TextFileStrategy');
class TextFileProductAdapter {

    // Define una propiedad privada estática para almacenar 
    // la única instancia de la clase Patrón Singleton. Se usa static para
    // dejar en claro que es una propiedad de la clase y no de instancias de la misma.

    static instance;

    // Constructor privado para evitar la creación de nuevas instancias 
    //fuera de la clase

    constructor(filePath) {
        if (TextFileProductAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.PersistenceManager = new PersistenceManager(new TextFileStrategy(filePath));
        TextFileProductAdapter.instance = this;
    }

    // Método estático para obtener la instancia única de la clase TextFileProductAdapter
    static getInstance(filePath) {
        if (!TextFileProductAdapter.instance) {
            TextFileProductAdapter.instance = new TextFileProductAdapter(filePath);
        }
        return TextFileProductAdapter.instance;
    }

    // Métodos de la clase TextFileProductAdapter
    // que van a ser guardados en data.json

    async getProducts() {
        try {
            const products = await this.PersistenceManager.load();
            if (products.length === 0) {
                throw new Error('Not found');
            }
            return products;
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    }


    async getProductById(idProduct) {
        try {
            const products = await this.PersistenceManager.load();
            if (products.length === 0 || products ==='null' || products === 'undefined') {
                throw new Error('Not found');
            }
            const found = products.find((product) => product.id === parseInt(idProduct));
            if (!found) {
                throw new Error("Not found");
            }
            return found;
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
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
            return newProduct.id;
        } catch (error) {
            throw new Error(`addProduct: ${error.message}`);
        }
    }


    async updateProduct(productId, productData) {
        const products = await this.persistenceManager.load();
        const productToUpdate = products.find((product) => product.id === productId);
        if (!productToUpdate) {
            throw new Error(`Product with id ${productId} not found`);
        }
        //Se actualizan los datos del producto con ID: productId, con las propiedades
        //enviadas por parámetro en productData
        //se utiliza ?? para asegurar la integridad de los datos a modificar
        //si vienen con null o undefined, simplemente no se modifican
        //y queda el valor original que traía desde el archivo.
        const updatedProduct = {
            id: productToUpdate.id,
            title: productData.title ?? productToUpdate.title,
            description: productData.description ?? productToUpdate.description,
            price: parseFloat(productData.price) ?? productToUpdate.price,
            thumbnail: productData.thumbnail ?? productToUpdate.thumbnail,
            stock: parseInt(productData.stock) ?? productToUpdate.stock,
        };

        // Se crea una nueva lista de productos con el producto actualizado. 
        //Esto se hace para asegurarse de que se mantenga la integridad de los datos.

        const updatedProducts = products.map((product) => {
            if (product.id === productId) {
                return updatedProduct;
            }
            return product;
        });
        //Se almacena todo el array de productos con el producto actualizado en data.json

        await this.persistenceManager.save(updatedProducts);
        return updatedProduct;
    }

    async deleteProduct(id) {
        try {
            //Se cargan los datos de los productos desde data.json
            const products = await this.PersistenceManager.load();
            const productIndex = products.findIndex((product) => product.id === id);
            //Si no se encuentra el producto en el archivo data.json 
            //findIndex devolverá -1
            if (productIndex === -1) {
                throw new Error(`Producto con ID: ${id} no encontrado`);
            }
            //Con splice se quita el producto con ID: productIndex
            
            products.splice(productIndex, 1);
            //Y se vuelve a guardar en data.json los restantes productos.
            await this.PersistenceManager.save(products);
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}

module.exports = TextFileProductAdapter;