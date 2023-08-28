import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: generateUniqueCode
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});

function generateUniqueCode() {
    // Genera un código único basado en la fecha y hora actual
    return `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

const Ticket = model('Ticket', ticketSchema);

export default Ticket;
