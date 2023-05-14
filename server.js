import app from "./app.js"
import { Server } from "socket.io"


const PORT = 8080
const ready = ()=> console.log(`Server ready on port: ${PORT}`)

const httpServer = app.listen(PORT, ready)
const socketServer = new Server(httpServer);


socketServer.on(
    'connection',
    socket => {
        console.log(`client ${socket.id} connected`)
    }
    //agregar recepcion de la autenticacion
        //en la practica debe emitir los mensajes de la memoria
        //en la entrega debe enviar las opciones del chatbot que crean necesarias
    //agregar recepcion del nuevo mensaje
        //en la práctica debe enviar los mensajes de la memoria
        //para la entrega debe emitir una respuesta
)