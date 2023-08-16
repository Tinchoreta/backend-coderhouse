import ProductModel from '../models/product.model.js';

export class ProductService {
    static createProduct(productData) {
        const product = new ProductModel(productData);
        return product.save();
    }
}
