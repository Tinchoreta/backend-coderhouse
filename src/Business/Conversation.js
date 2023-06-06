class Conversation {
    constructor(sessionId, user, startTime) {
        this.sessionId = sessionId;
        this.user = user;
        this.messages = [];
        this.startTime = startTime || new Date();
        this.endTime = null; // Timestamp de finalización de la conversación
    }

    addMessage(user, message) {
        this.messages.push({
            user: user, 
            message: message
        });
    }

    getAllMessages() {
        return this.messages;
    }

    endConversation() {
        this.endTime = new Date(); // Establecer el timestamp de finalización de la conversación
    }
}

export default Conversation;