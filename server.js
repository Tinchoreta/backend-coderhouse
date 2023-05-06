import express from 'express';
import TextFileCartManagerAdapter from './backend/Business/TextFileCartManagerAdapter.js';
import TextFileProductAdapter from './backend/Business/TextFileProductAdapter.js';
import CartManagerController from './backend/Business/CartManagerController.js';
import ProductManagerController from './backend/Business/ProductManagerController.js';

// import CartManager from './backend/Business/CartManager.js';

const server = express()

const PORT = 8080

const ready = ()=> console.log(`server ready on port: ${PORT}`)

server.listen(PORT, ready)

server.use(express.urlencoded({extended:true}))


const textFileCartAdapter = TextFileCartManagerAdapter.getInstance("./data/cartData.json");
const textFileProductAdapter = TextFileProductAdapter.getInstance("./data/data.json");
const cartManagerController =  new CartManagerController(textFileCartAdapter);
const productManagerController =  new ProductManagerController(textFileProductAdapter);

try {
    const PRODUCTS_ROUTE =  '/api/products'
        
    server.get(PRODUCTS_ROUTE, (request, response) => {
        productManagerController.getProducts(request, response);});
    
    let CART_ROUTE = '/api/carts'
    server.get(CART_ROUTE,(request, response) => {
        cartManagerController.getCarts(request, response);});
    
    const PRODUCT_ID_ROUTE = '/api/products/:id'
    server.get(PRODUCT_ID_ROUTE, (request, response) => {
        productManagerController.getProductById(request, response);});

    let CART_ID_ROUTE = '/api/carts/:id'
    server.get(CART_ID_ROUTE, (request, response) => {
        cartManagerController.getCartById(request, response);});

} catch (error) {
    console.log(error.message);
}