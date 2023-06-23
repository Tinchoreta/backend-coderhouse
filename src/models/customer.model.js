import mongoose from 'mongoose';
import Address from './address.model.js';

const { Schema } = mongoose;

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
        unique: true
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

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
