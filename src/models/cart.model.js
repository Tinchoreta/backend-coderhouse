import { Schema, model } from "mongoose";

let schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    products: [{
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: 'Products' },
        quantity: { type: Number, default: 0 }
    }]
},
    { strict: false }
);

let CartModel = model('Carts', schema);

export default CartModel;