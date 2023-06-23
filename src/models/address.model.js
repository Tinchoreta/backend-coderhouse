import mongoose from 'mongoose';

const { Schema } = mongoose;

const addressSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    company: String,
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: String,
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    additionalInfo: String,
    phone: {
        type: String,
        required: true
    },
    mobilePhone: String
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
