import express from 'express';
import __dirname from './utils.js'
import indexRoutes from './routes/index.js'

// import CartManager from './src/Business/CartManager.js';

const server = express()

const PORT = 8080

const ready = ()=> console.log(`server ready on port: ${PORT}`)

server.listen(PORT, ready)

server.use(express.json())

server.use(express.urlencoded({extended:true}))

server.use(express.static(__dirname + '/public'));

try {
    
    //console.log(indexRoutes.stack);
    server.use('/', indexRoutes);

} catch (error) {
    console.log(error.message);
}