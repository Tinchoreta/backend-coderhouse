import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

let schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

schema.plugin(mongoosePaginate);

let ProductModel = model('Products', schema);

export default ProductModel;
