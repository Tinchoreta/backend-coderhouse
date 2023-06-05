class Conversation {
    constructor(id, user) {
        this.id = id;
        this.user = user;
        this.messages = [];
        this.startTime = new Date(); // Timestamp de inicio de la conversación
        this.endTime = null; // Timestamp de finalización de la conversación
    }

    addMessage(message) {
        this.messages.push(message);
    }

    getAllMessages() {
        return this.messages;
    }

    endConversation() {
        this.endTime = new Date(); // Establecer el timestamp de finalización de la conversación
    }
}

export default Conversation;