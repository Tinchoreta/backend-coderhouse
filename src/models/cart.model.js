import {Schema, model } from "mongoose";

let collection = 'carts';
let schema = new Schema({
    products: {type: Array, required: true}
});

let CartModel = model(collection, schema);

export default CartModel;