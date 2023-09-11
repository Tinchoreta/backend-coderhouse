import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai from 'chai';

const { expect } = chai;

let mongoServer;

before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
