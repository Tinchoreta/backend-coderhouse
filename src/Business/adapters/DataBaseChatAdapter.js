import PersistenceManager from '../Data/PersistenceManager.js';
import DataBaseStrategy from '../Data/DataBaseStrategy.js';
import SessionModel from '../models/session.model.js';
import ConversationModel from '../models/conversation.model.js';

class DataBaseSessionAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseSessionAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, SessionModel));
        DataBaseSessionAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseSessionAdapter.instance) {
            DataBaseSessionAdapter.instance = new DataBaseSessionAdapter(uri);
        }
        return DataBaseSessionAdapter.instance;
    }

    async getSessions() {
        try {
            return await this.persistenceManager.load();
        } catch (error) {
            throw new Error(`getSessions: ${error.message}`);
        }
    }

    async getSessionById(sessionId) {
        try {
            return await this.persistenceManager.getOne({ _id: sessionId });
        } catch (error) {
            throw new Error(`getSessionById: ${error.message}`);
        }
    }

    async saveSession(sessionToSave) {
        try {
            return await this.persistenceManager.addOne(sessionToSave);
        } catch (error) {
            throw new Error(`saveSession: ${error.message}`);
        }
    }

    async deleteSession(sessionId) {
        try {
            const id = sessionId;
            if (!id) {
                throw new Error(`Session ID "${sessionId}" is not a valid number`);
            }

            const isDeleted = await this.persistenceManager.deleteOne({ _id: id });
            return isDeleted;

        } catch (error) {
            throw new Error(`deleteSession: ${error.message}`);
        }
    }
}

class DataBaseConversationAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseConversationAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, ConversationModel));
        DataBaseConversationAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseConversationAdapter.instance) {
            DataBaseConversationAdapter.instance = new DataBaseConversationAdapter(uri);
        }
        return DataBaseConversationAdapter.instance;
    }

    async getConversations() {
        try {
            return await this.persistenceManager.load();
        } catch (error) {
            throw new Error(`getConversations: ${error.message}`);
        }
    }

    async getConversationById(conversationId) {
        try {
            return await this.persistenceManager.getOne({ _id: conversationId });
        } catch (error) {
            throw new Error(`getConversationById: ${error.message}`);
        }
    }

    async saveConversation(conversationToSave) {
        try {
            return await this.persistenceManager.addOne(conversationToSave);
        } catch (error) {
            throw new Error(`saveConversation: ${error.message}`);
        }
    }

    async deleteConversation(conversationId) {
        try {
            const id = conversationId;
            if (!id) {
                throw new Error(`Conversation ID "${conversationId}" is not a valid number`);
            }

            const isDeleted = await this.persistenceManager.deleteOne({ _id: id });
            return isDeleted;

        } catch (error) {
            throw new Error(`deleteConversation: ${error.message}`);
        }
    }
}

export { DataBaseSessionAdapter, DataBaseConversationAdapter };
