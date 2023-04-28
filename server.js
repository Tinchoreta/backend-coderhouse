import express from 'express'
import TextFileCartManagerAdapter from './backend/Business/TextFileCartManagerAdapter'

const server = express()

const PORT = 8080

const ready = ()=> console.log(`server ready on port: ${PORT}`)

server.listen(PORT, ready)

server.use(express.urlencoded({extended:true}))


textFileCartAdapter = TextFileCartManagerAdapter.getInstance("./data/data.json")

const products_route =  '/products'
const products_function = (req, res)=> res.send({
success: true, 
products: []
})
server.get(products_route, products_function)


// let index_route = '/'
// let index_function = (req,res)=> {
//     let quantity = manager.read_users().length
//     console.log(quantity)
//     return res.send(`there are ${quantity} users`)
// }
// server.get(index_route,index_function)

// let one_route = '/users/:id'
// let one_function = (request,response)=> {
//     let parametros = request.params
//     let id = Number(parametros.id)
//     //console.log(id)
//     //console.log(typeof id)
//     let one = manager.read_user(id)
//     console.log(one)
//     if (one) {
//         return response.send({
//             success: true,
//             user: one
//         })
//     } else {
//         return response.send({
//             success: false,
//             user: 'not found'
//         })
//     }
    
// }
// server.get(one_route,one_function)

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