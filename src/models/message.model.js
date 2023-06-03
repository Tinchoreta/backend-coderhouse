import { Schema, model } from "mongoose";

let collection = 'messages';
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

let MessageModel = model(collection, schema);

export default MessageModel;