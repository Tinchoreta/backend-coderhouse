import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
    sessionOwner: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    conversations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
        },
    ]
}, { versionKey: false });

const ChatSessionModel = mongoose.model("ChatSession", chatSessionSchema);

export default ChatSessionModel;
