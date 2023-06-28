import {model, Schema} from 'mongoose';

const customerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    addresses: [{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }]
});

const Customer = model('Customer', customerSchema);

export default Customer;
