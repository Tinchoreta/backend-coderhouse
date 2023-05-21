import { Router } from "express"
import TextFileProductAdapter from "../../src/Business/TextFileProductAdapter.js";
import TextFileCartManagerAdapter from "../../src/Business/TextFileCartManagerAdapter.js";
import chatRouter from './chat.js'
import productsRouter from "./products.js";
import addProductRouter from "./addProduct.js"
import productDetailsRouter from "./productDetails.js";
import productSummaryRouter from "./productSummary.js";

// const textFileProductAdapter = TextFileProductAdapter.getInstance(
//     "./data/products.json"
// );

const textFileCartAdapter = TextFileCartManagerAdapter.getInstance("./data/carts.json");

const viewRouter = Router();

viewRouter.get('/', async (req, res, next) => {
    try {
        
        let name = "Tincho"
        let itemsOnCart = await textFileCartAdapter.calculateProductsQuantityOnCart(1);
        let totalPrice = 400//await textFileCartAdapter.calculateCartPrice(1);

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

viewRouter.use('/chat', chatRouter);
viewRouter.use('/new_product', addProductRouter);
viewRouter.use("/products", productsRouter);
viewRouter.use("/product_details", productDetailsRouter);
viewRouter.use("/product_summary", productSummaryRouter);


export default viewRouter;