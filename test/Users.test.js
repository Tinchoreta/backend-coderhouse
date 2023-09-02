import chai from 'chai';
import DataBaseUserAdapter from '../src/Business/adapters/DataBaseUserAdapter.js';
import User from '../src/models/user.model.js'; 
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const { expect } = chai;

describe('User Adapter CRUD Tests', () => {
    let mongoServer;
    let adapter;

    before(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.ensureInstance();
        
        const mongoUri = await mongoServer.getUri();
        mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        adapter = new DataBaseUserAdapter(mongoUri);
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Limpia la base de datos antes de cada prueba si es necesario
        await User.deleteMany({});
    });

    it('should create a new user', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            age: 30,
            password: 'password123',
        };

        const createdUser = await adapter.addUser(userData);
        expect(createdUser).to.be.an('object');
        expect(createdUser.firstName).to.equal(userData.firstName);
        expect(createdUser.lastName).to.equal(userData.lastName);
        expect(createdUser.email).to.equal(userData.email);
        
    });

    it('should get a user by ID', async () => {
        const userData = {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@example.com',
            age: 25,
            password: 'alice123',
        };

        const createdUser = await adapter.addUser(userData);
        const retrievedUser = await adapter.getUserById(createdUser._id.toString());
        expect(retrievedUser).to.be.an('object');
        expect(retrievedUser.firstName).to.equal(userData.firstName);
        expect(retrievedUser.lastName).to.equal(userData.lastName);
        expect(retrievedUser.email).to.equal(userData.email);
        
    });

    it('should update a user by ID', async () => {
        const userData = {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob@example.com',
            age: 35,
            password: 'bob123',
        };

        const createdUser = await adapter.addUser(userData);
        const updatedUserData = {
            firstName: 'UpdatedName',
        };

        const updatedUser = await adapter.updateUser(createdUser._id.toString(), updatedUserData);
        expect(updatedUser).to.be.an('object');
        expect(updatedUser.firstName).to.equal(updatedUserData.firstName);
        
    });

    it('should delete a user by ID', async () => {
        const userData = {
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie@example.com',
            age: 40,
            password: 'charlie123',
        };

        const createdUser = await adapter.addUser(userData);
        const isDeleted = await adapter.deleteUser(createdUser._id.toString());
        expect(isDeleted).to.equal(true);
        const retrievedUser = await adapter.getUserById(createdUser._id.toString());
        expect(retrievedUser).to.equal(null);
    });
});
