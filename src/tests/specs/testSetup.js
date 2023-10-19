import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai from 'chai';
import supertest from 'supertest';
import app from '../../app.js';
const { expect } = chai;

let mongoServer;

before(async () => {
    // this.timeout(5000);
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    mongoose.createConnection(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Simular la autenticación de un usuario y obtener un token
    const userCredentials = {
        email: 'tincho@landia.com',
        password: '1234abcd',
    };

    const res = await supertest(app) 
        .post('/api/auth/signin')
        .send(userCredentials);
    
    global.authToken = res.body.token;
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
