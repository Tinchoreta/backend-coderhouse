import mongoose from 'mongoose';

class DBStrategy {
    constructor(uri, model) {
        this.uri = uri;
        this.model = model;
        this.connection = null;
    }

    async connect() {
        try {
            this.connection = await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error; // Propagate the error to the caller
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            this.connection = null;
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error);
            throw error; // Propagate the error to the caller
        }
    }

    // getModel(collectionName, schemaDefinition) {
    //     if (!this.connection) {
    //         throw new Error('Not connected to MongoDB');
    //     }

    //     const schema = new mongoose.Schema(schemaDefinition);
    //     return this.connection.model(collectionName, schema);
    // }

    async save(collectionName, data) {
        try {
            await this.model.create(data);
            console.log(`Data saved to collection ${collectionName}`);
        } catch (error) {
            console.error(`Failed to save data to collection ${collectionName}:`, error);
            throw error; // Propagate the error to the caller
        }
    }

    async load(collectionName) {
        try {
            const data = await this.model.find({});
            console.log(`Data loaded from collection ${collectionName}`);
            return data;
        } catch (error) {
            console.error(`Failed to load data from collection ${collectionName}:`, error);
            throw error; // Propagate the error to the caller
        }
    }

    async delete(collectionName) {
        try {
            await this.model.deleteMany({});
            console.log(`Data deleted from collection ${collectionName}`);
        } catch (error) {
            console.error(`Failed to delete data from collection ${collectionName}:`, error);
            throw error; // Propagate the error to the caller
        }
    }
}

export default DBStrategy;

