import express from 'express';
import TextFileCartManagerAdapter from './backend/Business/TextFileCartManagerAdapter.js';
import TextFileProductAdapter from './backend/Business/TextFileProductAdapter.js';
const server = express()

const PORT = 8080

const ready = ()=> console.log(`server ready on port: ${PORT}`)

server.listen(PORT, ready)

server.use(express.urlencoded({extended:true}))


const textFileCartAdapter = TextFileCartManagerAdapter.getInstance("./data/cartData.json");
const textProductdapter = TextFileProductAdapter.getInstance("./data/data.json");

const products_route =  '/api/products'

const products_function = async (req, res)=> {
    const productos = await textProductdapter.getProducts()?? [];
    res.send({
        success: true, 
        products: productos
    })

}
server.get(products_route, products_function)


    let index_route = '/api/carts'
    let index_function = async (req,res)=> {
        let cartList = await textFileCartAdapter.getCarts() ?? [];
        
        return res.send({

            success: true,
            response: cartList
        })
    }
    server.get(index_route,index_function)


let one_route = '/api/products/:id'
let one_function = async (request,response)=> {
    let parametros = request.params
    let productIdToFind = Number(parametros.id)
    //console.log(id)
    //console.log(typeof id)
    let one = await textProductdapter.getProductById(productIdToFind);
    console.log(one)
    if (one) {
        return response.send({
            success: true,
            user: one
        })
    } else {
        return response.send({
            success: false,
            user: 'not found'
        })
    }
    
}
server.get(one_route,one_function)

// let query_route = '/users'
// let query_function = (req,res)=> {
//     console.log(req.query)
//     let quantity = req.query.quantity ?? 5
// /*     if (req.query.quantity) {

//     } */
//     let users = .slice(0,quantity) //array de usuarios que tengo que REBANAR para que se pagine según la query que envía el cliente
//     if (users.length>0) {
//         return res.send({
//             success: true,
//             users
//         })
//     } else {
//         return res.send({
//             success: false,
//             users: 'not found'
//         })
//     }    
// }
// server.get(query_route,query_function)