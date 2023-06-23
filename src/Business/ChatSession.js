class ChatSession {
    constructor(sessionOwner) {
        this.sessionOwner = sessionOwner;
        this.conversations = [];
        this.startTime = new Date(); // Timestamp de inicio de la sesión
        this.endTime = null; // Timestamp de finalización de la sesión
    }

    addConversation(conversation) {
        this.conversations.push(conversation);
    }

    getCurrentConversation() {
        return this.conversations.length > 0 ? this.conversations[this.conversations.length - 1] : null;
    }

    endSession() {
        this.endTime = new Date(); // Establece el timestamp de finalización de la sesión
    }
}

export default ChatSession;