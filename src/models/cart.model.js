import { Schema, model } from "mongoose";

let schema = new Schema({
    products: [{
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, default: 0 }
    }]
},
    { strict: false }
);

let CartModel = model('Carts', schema);

export default CartModel;