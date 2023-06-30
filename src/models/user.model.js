import {model, Schema} from 'mongoose';

const userSchema = new Schema({   
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true,
        default: "generic-user.jpg"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    password: {
        type: String,
        required: true
    }    
});

const User = model('User', userSchema);

export default User;



