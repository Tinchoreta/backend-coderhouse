import { Schema, model } from "mongoose";

let collection = 'carts';
let schema = new Schema({
    products: [{
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, default: 1 }
    }]
},
    { strict: false }
);

let CartModel = model(collection, schema);

export default CartModel;