import chai from 'chai';
import app from '../../app.js'; 
import ProductModel from '../../models/product.model.js'; 
import mongoose from 'mongoose';
import { generateOneHundredProducts } from '../productMocking.js'; // Importa la función para generar datos de prueba
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

const { expect } = chai;
const request = supertest(app);

describe('Product Router Tests', () => {
    
    let mongoServer; 

    before(async () => {
        // Inicializa el servidor de memoria MongoDB antes de las pruebas
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {

        const productsToInsert = generateOneHundredProducts();
        await ProductModel.insertMany(productsToInsert);
    });

    afterEach(async () => {
        // Limpia la base de datos de prueba después de cada prueba
        await ProductModel.deleteMany({});
    });

    it('should get all products', async () => {
        const res = await request.get('/api/products');
        // console.log(res);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");

        expect(res.body.payload).to.be.an('array');
        expect(res.body.payload.length).to.be.greaterThan(0);

        const firstProduct = res.body.payload[0];
        expect(firstProduct).to.have.property('title');
        expect(firstProduct).to.have.property('description');
        expect(firstProduct).to.have.property('price');
        expect(firstProduct).to.have.property('thumbnail');
        expect(firstProduct).to.have.property('stock');
        expect(firstProduct).to.have.property('category');

        expect(firstProduct.price).to.be.a('number');
        expect(firstProduct.price).to.be.greaterThan(0);

        expect(firstProduct.title).to.be.a('string').and.not.empty;
    });
});