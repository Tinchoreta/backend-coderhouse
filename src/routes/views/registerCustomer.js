import { Router } from "express"
const registerCustomerRouter = Router();


registerCustomerRouter.get('/', async (req, res, next) => {
    try {
        return res.render('registerCustomer', {
            title: 'registerCustomer',
            script: 'registerCustomer.js',
            css: 'registerCustomer.css'
        });
    } catch (error) {
        next(error);
    }
})

export default registerCustomerRouter;