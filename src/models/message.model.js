import { Schema, model } from "mongoose";

let schema = new Schema({
    user: { // username con email
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    message: { 
        type: String,
        required: true
    }
    
});

let MessageModel = model('Messages', schema);

export default MessageModel;