import PersistenceManager from '../../persistence/PersistenceManager.js';
import DataBaseStrategy from '../../persistence/DataBaseStrategy.js';
import ProductModel from '../../models/product.model.js';

class DataBaseProductAdapter {
    static instance = null;

    constructor(uri) {
        if (DataBaseProductAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, ProductModel));
        this.model = ProductModel;
        DataBaseProductAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseProductAdapter.instance) {
            DataBaseProductAdapter.instance = new DataBaseProductAdapter(uri);
        }
        return DataBaseProductAdapter.instance;
    }

    async getProducts(limit = 6, page = 1, sort = "", title = "") {
        try {
            const options = {
                limit: !Number.isNaN(parseInt(limit)) ? parseInt(limit) : 6,
                page: !Number.isNaN(parseInt(page)) ? parseInt(page) : 1,
                sort: {},
            };

            const query = {};

            // Verificar si se proporcionó un título
            if (title) {
                query.title = { $regex: new RegExp(`^${title}`, "i") };
            }

            // Verificar si se proporcionó una ordenación
            if (sort === "name-asc") {
                options.sort = { title: 1 };
            }
            if (sort === "name-desc") {
                options.sort = { title: -1 };
            }
            if (sort === "stock") {
                options.sort = { stock: -1 };
            }
            if (sort === "price-asc" || sort === "asc") {
                options.sort = { price: 1 };
            }
            if (sort === "price-desc" || sort === "desc") {
                options.sort = { price: -1 };
            }

            const result = await this.model.paginate(query, options);

            return result;
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    }

    async getProductById(idProduct) {
        try {
            return await this.persistenceManager.getOne({ _id: idProduct });
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
            const productId = id;

            if (!productId) {
                throw new Error(`Invalid product ID: ${productId}`);
            }

            return await this.persistenceManager.modifyOne({ _id: productId }, productToUpdate);
        } catch (error) {
            throw new Error(`updateProduct: ${error.message}`);
        }
    }

    async deleteProduct(idToDelete) {
        try {
            const id = idToDelete;
            if (!id) {
                throw new Error(`Product ID "${idToDelete}" is not a valid number`);
            }

            const isDeleted = await this.persistenceManager.deleteOne({ _id: id });

            return isDeleted;
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }

    async getProductByTitleAndDescription(title, description) {
        try {
            // Construir los criterios de búsqueda
            const query = {
                // Buscar documentos que coincidan exactamente con el título proporcionado (insensible a mayúsculas y minúsculas)
                // title: new RegExp(title) 
                _id: '649d128c814a7cbbae82dfcf'
            };

            const products = await this.persistenceManager.getMany({});

            return products;
        } catch (error) {
            throw new Error(`getProductByTitleAndDescription: ${error.message}`);
        }
    }
}

export default DataBaseProductAdapter;
