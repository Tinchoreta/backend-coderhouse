import PersistenceManager from '../../persistence/PersistenceManager.js';
import DataBaseStrategy from '../../persistence/DataBaseStrategy.js';
import ProductModel from '../../models/product.model.js';

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

    async getProducts(limit = 10, page = 1, sort = "", query = {}) {
        try {
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
            };

            // Verifico si se proporcionó una ordenación
            if (sort === "asc" || sort === "desc") {
                options.sort = { price: sort === "asc" ? 1 : -1 };
            }

            const aggregationStages = [
                {
                    $match: query,
                },
                {
                    $sort: options.sort || undefined,
                },
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

            // Realizamos la consulta utilizando aggregates y paginate de Mongoose
            const result = await this.model.aggregate(aggregationStages);

            // Extraemos los resultados paginados y el total de elementos
            const products = result[0].paginatedResults;
            const totalCount = result[0].totalCount[0].count;

            return { products, totalCount };
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

            // console.log(result + ' deleted adapter');

            return isDeleted;

        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}

export default DataBaseProductAdapter;
