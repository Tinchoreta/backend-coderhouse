import chai from 'chai';
import app from '../../app.js';
import supertest from 'supertest';
import CartModel from '../../models/cart.model.js'; 
import UserModel from '../../models/user.model.js'; 

const { expect } = chai;
const request = supertest(app);

describe('Cart Router Tests', () => {

    let testCartId;
    let testUserId;

    it('should get all carts', async () => {
        const res = await request.get('/api/carts')
        .set('Authorization', `Bearer ${global.authToken}`);
        console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an('array');
        expect(res.body.payload.length).to.be.greaterThan(0);
    });

    it('should create a new cart', async () => {
        const res = await request.post('/api/carts').send({ userId: testUserId })
        .set('Authorization', `Bearer ${global.authToken}`);
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an('object');
        expect(res.body.payload.userId).to.equal(testUserId.toString());
    });

    it('should get a cart by ID', async () => {
        const res = await request.get(`/api/carts/${testCartId}`)
        .set('Authorization', `Bearer ${global.authToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an('object');
        expect(res.body.payload._id).to.equal(testCartId.toString());
    });

    it('should calculate the total price of a cart', async () => {
        const res = await request.get(`/api/carts/${testCartId}/bills`)
        .set('Authorization', `Bearer ${global.authToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.a('number');
    });

    it('should process a cart purchase', async () => {
        const res = await request.get(`/api/carts/${testCartId}/purchase`)
        .set('Authorization', `Bearer ${global.authToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload.message).to.equal("Purchase processed successfully");
    });

    it('should remove a product from a cart', async () => {
        // Añade un producto ficticio al carrito para luego eliminarlo
        const productToAdd = { productId: 'fakeProductId', quantity: 1 };
        await CartModel.findByIdAndUpdate(testCartId, { $push: { products: productToAdd } });

        const res = await request.delete(`/api/carts/${testCartId}/product/${productToAdd.productId}`)
        .set('Authorization', `Bearer ${global.authToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload.message).to.equal("Product removed from cart");
    });

    it('should add product units to a cart', async () => {
        // Añade un producto ficticio al carrito para luego agregar unidades
        const productToAdd = { productId: 'fakeProductId', quantity: 1 };
        await CartModel.findByIdAndUpdate(testCartId, { $push: { products: productToAdd } });

        const res = await request.put(`/api/carts/${testCartId}/product/${productToAdd.productId}/add/2`)
        .set('Authorization', `Bearer ${global.authToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload.message).to.equal("Product units added to cart");
    });

    it('should remove product units from a cart', async () => {
        // Añade un producto ficticio al carrito con 3 unidades para luego eliminar 2 unidades
        const productToAdd = { productId: 'fakeProductId', quantity: 3 };
        await CartModel.findByIdAndUpdate(testCartId, { $push: { products: productToAdd } });

        const res = await request.delete(`/api/carts/${testCartId}/product/${productToAdd.productId}/remove/2`)
        .set('Authorization', `Bearer ${global.authToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload.message).to.equal("Product units removed from cart");
    });
});
