import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    user: {
        type: String,
        required: true,
        match: /.+\@.+\..+/  // Validación de formato de email
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    messages: [
        {
            user: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ]
});

const ConversationModel = mongoose.model("Conversation", conversationSchema);

export default ConversationModel;
