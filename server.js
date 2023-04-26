import express from 'express'

const server = express()

const PORT = 8080

const ready = ()=> console.log(`server ready on port: ${PORT}`)

server.listen(PORT, ready)

server.use(express.urlencoded({extended:true}))

const products_route =  '/products'
const products_function = (req, res)=> res.send({
success: true, 
products: []
})
server.get(products_route, products_function)