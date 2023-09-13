import chai from 'chai';
import app from '../../app.js';
import ProductModel from '../../models/product.model.js';
import { generateOneHundredProducts } from '../productMocking.js';
import supertest from 'supertest';


const { expect } = chai;
const request = supertest(app);

describe('Product Router Tests', () => {
    
    beforeEach(async () => {
        const productsToInsert = generateOneHundredProducts();
        await ProductModel.insertMany(productsToInsert);
    });

    afterEach(async () => {
        await ProductModel.deleteMany({});
    });

    it('should get all products', async () => {
        const res = await request.get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");

        const products = res.body.payload;
        expect(products).to.be.an('array');
        expect(products).to.have.length.greaterThan(0);
    });

    it('should create a new product', async () => {
        const newProduct = {
            title: 'New Product',
            description: 'Description of the new product',
            price: 19.99,
            thumbnail: 'new-product.jpg',
            stock: 100,
            category: 'Electronics'
        };

        const res = await request.post('/api/products').send(newProduct);
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal("success");
        const createdProduct = res.body.payload;
        expect(createdProduct).to.have.property('title', newProduct.title);
        // Add more assertions for other fields
    });

    it('should update an existing product', async () => {
        const products = await ProductModel.find({});
        const productToUpdate = products[0];
        const updatedProduct = {
            title: 'Updated Product Title',
        };

        const res = await request.put(`/api/products/${productToUpdate._id}`).send(updatedProduct);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        const updatedProductResponse = res.body.payload;
        expect(updatedProductResponse).to.have.property('title', updatedProduct.title);
    });

    it('should delete an existing product', async () => {
        const products = await ProductModel.find({});
        const productToDelete = products[0];

        const res = await request.delete(`/api/products/${productToDelete._id}`);
        expect(res.status).to.equal(204);
        const deletedProduct = await ProductModel.findById(productToDelete._id);
        expect(deletedProduct).to.be.null;
    });
    
});
