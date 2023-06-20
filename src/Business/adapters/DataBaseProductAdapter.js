import PersistenceManager from '../../persistence/PersistenceManager.js';
import DataBaseStrategy from '../../persistence/DataBaseStrategy.js';
import ProductModel from '../../models/product.model.js';
import mongoose from 'mongoose';

class DataBaseProductAdapter {
    static instance;

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

    async getProducts(limit = 6, page = 1, sort = "", query = {}) {
        try {
            const options = {
                limit: !Number.isNaN(parseInt(limit)) ? parseInt(limit) : 6,
                page: !Number.isNaN(parseInt(page)) ? parseInt(page) : 1,
                sort: {}
            };

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

            //Gestionar todos los aggregation stages
            const aggregationStages = [
                {
                    $match: query,
                },
                ...(Object.keys(options.sort).length !== 0 ? [{ $sort: options.sort }] : []),
                {
                    $facet: {
                        paginatedResults: [
                            { $skip: (options.page - 1) * options.limit },
                            { $limit: options.limit },
                        ],
                        totalCount: [
                            {
                                $count: "count",
                            },
                        ],
                    },
                },
            ];

            // Realizar la consulta utilizando aggregates y paginate de Mongoose
            const result = await this.model.aggregate(aggregationStages).collation({ locale: "en" });

            // Extraer los resultados paginados y el total de elementos
            const products = result[0]?.paginatedResults;
            const totalCount = result[0]?.totalCount[0]?.count;

            return { products, totalCount };
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    }




    async isValidProductId(productId) {
        try {
            let isValid = await mongoose.isValidObjectId(productId);
            return isValid;
        } catch (error) {
            throw new Error(`isValidProductId: ${error.message}`);
        }
    }


    async getProductById(idProduct) {
        try {
            let isValidId = await this.isValidProductId(idProduct)
            if (!isValidId) return null;

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

            // console.log(result + ' deleted adapter');

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
                title: { $regex: new RegExp(`^${title}$`, 'i') },
                // Buscar documentos que coincidan exactamente con la descripción proporcionada (insensible a mayúsculas y minúsculas)
                description: { $regex: new RegExp(`^${description}$`, 'i') },
            };

            const products = await this.persistenceManager.getMany(query);

            return products;
        } catch (error) {

            throw new Error(`getProductByTitleAndDescription: ${error.message}`);
        }
    }

    // async populateCartsWithProducts(carts) {
    //     try {
    //         const populatedCarts = await this.persistenceManager.populateMany(carts, { path: 'products' });
    //         return populatedCarts;
    //     } catch (error) {
    //         throw new Error(`populateCartsWithProducts: ${error.message}`);
    //     }
    // }


}

export default DataBaseProductAdapter;
