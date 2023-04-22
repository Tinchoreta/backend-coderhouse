

class ProductAdapter {

    // Define una propiedad privada estática para almacenar 
    // la única instancia de la clase Patrón Singleton. Se usa static para
    // dejar en claro que es una propiedad de la clase y no de instancias de la misma.
    
    static #instance;

    // Constructor privado para evitar la creación de nuevas instancias 
    //fuera de la clase

    static instance = null;

    constructor(filePath) {
        if (ProductAdapter.instance !== null) {
            return ProductAdapter.instance;
        }

        this.PersistenceManager = new PersistenceManager(new TextFileStrategy(filePath));
        ProductAdapter.instance = this;
    }

     // Método estático para obtener la instancia única de la clase ProductAdapter
    static getInstance(filePath) {
        if (!ProductAdapter.#instance) {
            ProductAdapter.#instance = new ProductAdapter(filePath);
        }
        return ProductAdapter.#instance;
    }

   // Métodos de la clase ProductAdapter
    // que van a ser 

    async getProducts() {
        try {
            const products = await this.PersistenceManager.load();
            if (products.length === 0) {
                throw new Error('Not found');
            }
            return products;
        } catch (error) {
            throw new Error('getProducts: error');
        }
    }

    async addProduct({ title, description, price, thumbnail, stock }) {
        try {
            const products = await this.PersistenceManager.load();
            const newProduct = { id: products.length + 1, title, description, price, thumbnail, stock };
            products.push(newProduct);
            await this.PersistenceManager.save(products);
            return newProduct.id;
        } catch (error) {
            throw new Error(`addProduct: ${error.message}`);
        }
    }

    addProduct ({ title, description, price, thumbnail, stock }) {
        if (!title || title.length === 0) {
            throw new Error('El campo título es obligatorio');
        }
        if (!description || description.length === 0) {
            throw new Error('El campo descripción es obligatorio');
        }
        if (!price || price <= 0) {
            throw new Error('El campo precio es obligatorio y debe ser mayor que cero');
        }
        if (!thumbnail || thumbnail.length === 0) {
            throw new Error('El campo imagen es obligatorio');
        }
        if (stock < 0) {
            throw new Error('El campo stock no puede ser menor que cero');
        }
        
        //si el stock no se especifica, por defecto será cero.

        stock = stock ?? 0;

        const newId = this.getLastId() + 1;
        const newProduct = new Product(newId, title, description, price, thumbnail, stock);
        this.products.push(newProduct);
        return newId;
    };

    async editProduct(id, productData) {
        try {
            const products = await this.PersistenceManager.load();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error(`Producto con ID: ${id} no encontrado`);
            }
            const editedProduct = { id, ...productData };
            products[productIndex] = editedProduct;
            await this.PersistenceManager.save(products);
            return editedProduct;
        } catch (error) {
            throw new Error(`editProduct: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.PersistenceManager.load();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error(`Producto con ID: ${id} no encontrado`);
            }
            products.splice(productIndex, 1);
            await this.PersistenceManager.save(products);
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}