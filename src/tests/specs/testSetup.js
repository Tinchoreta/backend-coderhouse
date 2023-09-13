import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai from 'chai';

const { expect } = chai;

let mongoServer;

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.createConnection(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
