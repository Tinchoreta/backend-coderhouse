import PersistenceManager from '../../persistence/PersistenceManager.js';
import DataBaseStrategy from '../../persistence/DataBaseStrategy.js';
import ChatSessionModel from '../../models/chatSession.model.js';
import ConversationModel from '../../models/conversation.model.js';

class DataBaseSessionAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseSessionAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, ChatSessionModel));
        DataBaseSessionAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseSessionAdapter.instance) {
            DataBaseSessionAdapter.instance = new DataBaseSessionAdapter(uri);
        }
        return DataBaseSessionAdapter.instance;
    }

    async getChatSessions() {
        try {
            return await this.persistenceManager.load();
        } catch (error) {
            throw new Error(`getChatSessions: ${error.message}`);
        }
    }

    async getChatSessionById(chatSessionId) {
        try {
            return await this.persistenceManager.getOne({ _id: chatSessionId });
        } catch (error) {
            throw new Error(`getChatSessionById: ${error.message}`);
        }
    }

    async saveChatSession(sessionToSave) {
        try {
            return await this.persistenceManager.addOne(sessionToSave);
        } catch (error) {
            throw new Error(`saveChatSession: ${error.message}`);
        }
    }

    async deleteChatSession(chatSessionId) {
        try {
            const id = chatSessionId;
            if (!id) {
                throw new Error(`Session ID "${chatSessionId}" is not a valid number`);
            }

            const isDeleted = await this.persistenceManager.deleteOne({ _id: id });
            return isDeleted;

        } catch (error) {
            throw new Error(`deleteChatSession: ${error.message}`);
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

export { DataBaseSessionAdapter as DataBaseChatSessionAdapter, DataBaseConversationAdapter };
