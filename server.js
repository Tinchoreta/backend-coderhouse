import app from "./app.js"
import { Server } from "socket.io"


const PORT = 8080
const ready = () => console.log(`Server ready on port: ${PORT}`)

const httpServer = app.listen(PORT, ready)
const socketServer = new Server(httpServer);

const chats = [];
// socketServer.on("connection", (socket) => {
//     // socket server trabaja para todos los clientes
//     //   console.log(socket.client.id);
//     socket.on("auth", () => {
//         //socket solo para cada cliente
//         socketServer.emit("allMessages", chats);
//     });
//     socket.on("newMessage", (data) => {
//         chats.push(data);
//         console.log(chats);
//         socketServer.emit("allMessages", chats);
//     });
// });

socketServer.on("connection", (socket) => {
    let isAuthenticated = false;

    const sendMessage = (message) => {
        socket.emit("newMessage", message);
    };

    const processInput = (input) => {
        const message = String(input).toLowerCase().trim();

        if (!isAuthenticated) {
            if (message === "/start") {
                
                console.log(message);
                isAuthenticated = true;
                sendMessage("Hola, bienvenido a Bootshop. Elige una opción:");
                sendMessage("1. Ver producto más barato");
                sendMessage("2. Ver producto más caro");
                sendMessage("3. Salir");
            } else {
                sendMessage("Bienvenido a Bootshop! Para comenzar, escribe '/start'");
            }
        }  
        else {
        if (message === "1") {
            sendMessage("El producto más barato es ...");
        } else if (message === "2") {
            sendMessage("El producto más caro es ...");
        } else if (message === "3") {
            sendMessage("Gracias por usar Bootshop. ¡Hasta luego!");
            isAuthenticated = false;
        } else {
            sendMessage("Opción inválida. Por favor, elige una opción válida.");
        }
    }
};

socket.on("newMessage", (data) => {
    processInput(data);
});
});


    //agregar recepcion de la autenticacion
        //en la practica debe emitir los mensajes de la memoria
        //en la entrega debe enviar las opciones del chatbot que crean necesarias
    //agregar recepcion del nuevo mensaje
        //en la práctica debe enviar los mensajes de la memoria
        //para la entrega debe emitir una respuesta
