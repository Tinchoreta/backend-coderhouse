import { Router } from "express"
import chatRouter from './chat.js'
import productsRouter from "./products.js";
import addProductRouter from "./addProduct.js"
import productDetailsRouter from "./productDetails.js";
import productSummaryRouter from "./productSummary.js";


const viewRouter = Router();

viewRouter.get('/', async (req, res, next) => {
    try {
        
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