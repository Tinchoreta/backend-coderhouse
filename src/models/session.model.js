import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
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

const SessionModel = mongoose.model("Session", sessionSchema);

export default SessionModel;