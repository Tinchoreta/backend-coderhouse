import mongoose from 'mongoose';

class DBStrategy {
    constructor(uri) {
        this.uri = uri;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error);
        }
    }

    async save(data) {
        try {
            const model = mongoose.model('Data', new mongoose.Schema({}));
            const instance = new model(data);
            await instance.save();
            console.log('Data saved to MongoDB');
        } catch (error) {
            console.error('Failed to save data to MongoDB:', error);
        }
    }

    async load() {
        try {
            const model = mongoose.model('Data', new mongoose.Schema({}));
            const data = await model.find({});
            console.log('Data loaded from MongoDB');
            return data;
        } catch (error) {
            console.error('Failed to load data from MongoDB:', error);
            return [];
        }
    }

    async delete() {
        try {
            const model = mongoose.model('Data', new mongoose.Schema({}));
            await model.deleteMany({});
            console.log('Data deleted from MongoDB');
        } catch (error) {
            console.error('Failed to delete data from MongoDB:', error);
        }
    }
}

export default DBStrategy;
