import PersistenceManager from '../Data/PersistenceManager.js';
import DataBaseStrategy from '../Data/DataBaseStrategy.js';
import MessageModel from '../models/message.model.js';

class DataBaseMessageAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseMessageAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, MessageModel));
        DataBaseMessageAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseMessageAdapter.instance) {
            DataBaseMessageAdapter.instance = new DataBaseMessageAdapter(uri);
        }
        return DataBaseMessageAdapter.instance;
    }

    async getMessages() {
        try {
            return await this.persistenceManager.load();
        } catch (error) {
            throw new Error(`getMessages: ${error.message}`);
        }
    }

    async getMessageById(idMessage) {
        try {
            return await this.persistenceManager.getOne({ _id: idMessage });
        } catch (error) {
            throw new Error(`getMessageById: ${error.message}`);
        }
    }

    async getMessagesByUserEmail(userEmail) {
        try {
            return await this.persistenceManager.getMany({ user: userEmail });
        } catch (error) {
            throw new Error(`getMessageById: ${error.message}`);
        }
    }

    async saveMessage(MessageToSave) {
        try {
            return await this.persistenceManager.addOne(MessageToSave);
        } catch (error) {
            throw new Error(`addMessage: ${error.message}`);
        }
    }

    async deleteMessage(idToDelete) {
        try {
            const id = idToDelete;
            if (!id) {
                throw new Error(`Message ID "${idToDelete}" is not a valid number`);
            }

            const isDeleted = await this.persistenceManager.deleteOne({ _id: id });

            // console.log(result + ' deleted adapter');

            return isDeleted;

        } catch (error) {
            throw new Error(`deleteMessage: ${error.message}`);
        }
    }
}

export default DataBaseMessageAdapter;
