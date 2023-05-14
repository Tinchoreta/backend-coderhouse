import { Router } from "express"
const productRouter = Router();


productRouter.get('/', async(req,res,next)=> {
    try {
        return res.render('addProduct',{
            title: 'Product Add',
            script: 'product.js',
            css: 'product.css'
        });
    } catch(error) {
        next(error);
    }
})

export default productRouter;