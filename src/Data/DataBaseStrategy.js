import mongoose from 'mongoose';

class DataBaseStrategy {
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
            throw error;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            this.connection = null;
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error);
            throw error;
        }
    }

    async save(data) {
        try {
            const document = new this.model(data);
            await document.save();
            // console.log('Data saved to collection:', this.model.collection.collectionName);
        } catch (error) {
            console.error('Failed to save data:', error);
            throw error;
        }
    }

    async load() {
        try {
            const data = await this.model.find({});
            // console.log('Data loaded from collection:', this.model.collection.collectionName);
            return data;
        } catch (error) {
            console.error('Failed to load data:', error);
            throw error;
        }
    }

    async delete() {
        try {
            await this.model.deleteMany({});
            // console.log('Data deleted from collection:', this.model.collection.collectionName);
        } catch (error) {
            console.error('Failed to delete data:', error);
            throw error;
        }
    }

    async getOne(filter) {
        try {
            const data = await this.model.findOne(filter);
            console.log('Retrieved document from collection:', this.model.collection.collectionName + " " + data); 
            return data ? data : null;
        } catch (error) {
            console.error('Failed to retrieve document:', error);
            throw error;
        }
    }

    async deleteOne(filter) {
        try {
            const result = await this.model.deleteOne(filter);
            // console.log('Deleted document from collection:', this.model.collection.collectionName);

            const isDeleted = result.deletedCount > 0;
            // console.log(isDeleted + ' deleteOne strategy was called');
            return isDeleted;
        } catch (error) {
            console.error('Failed to delete document:', error);
            throw error;
        }
    }

    async modifyOne(filter, update) {
        try {
            const result = await this.model.updateOne(filter, update);
            // console.log('Modified document in collection:', this.model.collection.collectionName);
            const itemModified = result.modifiedCount === 1? await this.getOne(filter) : null;
            return itemModified;
        } catch (error) {
            console.error('Failed to modify document:', error);
            throw error;
        }
    }

    async addOne(data) {
        try {
            const document = new this.model(data);
            const result = await document.save();
            // console.log('Added document to collection: ', this.model.collection.collectionName);
            return result;
        } catch (error) {
            console.error('Failed to add document:', error);
            throw error;
        }
    }
}

export default DataBaseStrategy;
