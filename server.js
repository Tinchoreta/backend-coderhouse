import express from 'express';
import TextFileCartManagerAdapter from './src/Business/TextFileCartManagerAdapter.js';
import TextFileProductAdapter from './src/Business/TextFileProductAdapter.js';
import CartManagerController from './src/Business/CartManagerController.js';
import ProductManagerController from './src/Business/ProductManagerController.js';
import __dirname from './utils.js'
import indexRoutes from './routes/index.js'

// import CartManager from './src/Business/CartManager.js';

const server = express()

const PORT = 8080

const ready = ()=> console.log(`server ready on port: ${PORT}`)

server.listen(PORT, ready)

server.use(express.json())

server.use(express.urlencoded({extended:true}))

// server.use(express.static(__dirname + '/public'));

// const textFileCartAdapter = TextFileCartManagerAdapter.getInstance("./data/carts.json");
// const textFileProductAdapter = TextFileProductAdapter.getInstance("./data/products.json");
// const cartManagerController =  new CartManagerController(textFileCartAdapter);
// const productManagerController =  new ProductManagerController(textFileProductAdapter);

try {
    const PRODUCTS_ROUTE =  '/api/products'
    const CARTS_ROUTE = '/api/carts'
    
    //console.log(indexRoutes.stack);
    server.use('/', indexRoutes);


    // const CARTS_ROUTE = '/api/carts'
    // server.get(CARTS_ROUTE,(request, response) => {
    //     cartManagerController.getCarts(request, response);});
    
    // const PRODUCT_ID_ROUTE = '/api/products/:id'
    // server.get(PRODUCT_ID_ROUTE, (request, response) => {
    //     productManagerController.getProductById(request, response);});

    // const CART_ID_ROUTE = '/api/carts/:id'
    // server.get(CART_ID_ROUTE, (request, response) => {
    //     cartManagerController.getCartById(request, response);});

} catch (error) {
    console.log(error.message);
}