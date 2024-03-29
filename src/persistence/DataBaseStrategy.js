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
            // console.log('Retrieved document from collection:', this.model.collection.collectionName + " " + data); 
            return data ? data : null;
        } catch (error) {
            console.error('Failed to retrieve document:', error);
            throw error;
        }
    }

    async getMany(filter, sortOptions = null, limit = null) {
        try {
            let query = await this.model.find(filter);

            if (sortOptions !== null) {
                query = query.sort(sortOptions);
            }

            if (limit !== null) {
                query = query.limit(limit);
            }

            return query ? query : null;
        } catch (error) {
            console.error('Failed to retrieve documents (getMany):', error);
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
            
            const result = await this.model(data).save();
            
            return result;
        } catch (error) {
            console.error('Failed to add document:', error);
            throw error;
        }
    }
    async populateOne(idToPopulate, collection, key, options) {
        try {
            const populatedDocs = await this.model
                .findById(idToPopulate)
                .populate(`${collection}.${key}`, null, null, options);
            return populatedDocs;
        } catch (error) {
            console.error(`populateOne: ${error.message}`);
            throw error;
        }
    }

    async populateMany(collection, key, options) {
        try {
            const populatedDocs = await this.model
                .find({})
                .populate(`${collection}.${key}`, null, null, options);
            return populatedDocs;
        } catch (error) {
            console.error(`populateMany: ${error.message}`);
            throw error;
        }
    }

    async aggregate(pipeline) {
        try {
            const result = await this.model                
                .aggregate(pipeline);
            return result;
        } catch (error) {
            throw new Error(`aggregate: ${error.message}`);
        }
    }
    async find(filter) {
        try {
            const result = await this.model.find(filter);
            return result;
        } catch (error) {
            throw new Error(`find: ${error.message}`);
        }
    }

}
export default DataBaseStrategy;
