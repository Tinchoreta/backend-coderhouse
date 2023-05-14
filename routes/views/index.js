import { Router } from "express"
import TextFileProductAdapter from "../../src/Business/TextFileProductAdapter.js";
// import {
//     validateProductExistence,
//     validateProductFields,
// } from "../../middlewares/productMiddlewares.js";

const router = Router();

const textFileProductAdapter = TextFileProductAdapter.getInstance(
    "./data/products.json"
);

const viewRouter = Router();

viewRouter.get('/', async (req, res, next) => {
    try {
        
        let name = "Tincho"
        let itemsOnCart = await textFileProductAdapter.getProducts().length;
        let totalPrice = 150;

        return res.render('index', {
            title: 'BootShop',
            user: name,
            itemsOnCart1: itemsOnCart,
            totalPrice: totalPrice
        });
    } catch (error) {
        next(error);
    }
})

export default viewRouter;