import chai from 'chai';
import DataBaseUserAdapter from '../../Business/adapters/DataBaseUserAdapter.js';
import User from '../../models/user.model.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const { expect } = chai;

describe('User Adapter CRUD Tests', () => {
    let mongoServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('Create User', () => {
        it('should create a new user', async () => {
            const adapter = DataBaseUserAdapter.getInstance();
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                age: 30,
                password: 'password123',
            };
            console.log('Running create user test...');
            const createdUser = await adapter.addUser(userData);
            expect(createdUser).to.be.an('object');
            expect(createdUser.firstName).to.equal(userData.firstName);
            expect(createdUser.lastName).to.equal(userData.lastName);
            expect(createdUser.email).to.equal(userData.email);
        });
    });

    describe('Get User', () => {
        it('should get a user by ID', async () => {
            const adapter = DataBaseUserAdapter.getInstance();
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
    });

    describe('Update User', () => {
        it('should update a user by ID', async () => {
            const adapter = DataBaseUserAdapter.getInstance();
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
    });

    describe('Delete User', () => {
        it('should delete a user by ID', async () => {
            const adapter = DataBaseUserAdapter.getInstance();
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
});
