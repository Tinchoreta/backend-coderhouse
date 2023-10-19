import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Carts',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user',
    },
    resetPasswordToken: { String }, 
    resetPasswordExpires: { Date },
});

userSchema.set('strict', false);
const User = model('Users', userSchema);

export default User;


