import app from "./app.js"
import { Server } from "socket.io"


const PORT = 8080
const ready = () => console.log(`Server ready on port: ${PORT}`)

const httpServer = app.listen(PORT, ready)
const socketServer = new Server(httpServer);

const chats = [];
socketServer.on("connection", (socket) => {
        // socket server trabaja para todos los clientes
        //   console.log(socket.client.id);
        socket.on("auth", () => {
            //socket solo para cada cliente
            socketServer.emit("allMessages", chats);
        });
        socket.on("newMessage", (data) => {
            chats.push(data);
            console.log(chats);
            socketServer.emit("allMessages", chats);
        });
    });



    //agregar recepcion de la autenticacion
        //en la practica debe emitir los mensajes de la memoria
        //en la entrega debe enviar las opciones del chatbot que crean necesarias
    //agregar recepcion del nuevo mensaje
        //en la práctica debe enviar los mensajes de la memoria
        //para la entrega debe emitir una respuesta
