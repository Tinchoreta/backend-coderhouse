import app from "./app.js"
import { Server } from "socket.io"
import Chat from "./src/Business/Chat.js"
import DataBaseProductAdapter from "./src/Business/adapters/DataBaseProductAdapter.js"
import DataBaseMessageAdapter from "./src/Business/adapters/DataBaseCartManagerAdapter.js"

const PORT = 8080
const ready = () => console.log(`Server ready on port: ${PORT}`)

const httpServer = app.listen(PORT, ready)
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    const productAdapter = DataBaseProductAdapter.getInstance(process.env.MONGO_DB_URI);
    const messageAdapter = DataBaseMessageAdapter.getInstance(process.env.MONGO_DB_URI);
    const chat = new Chat(socket, productAdapter, messageAdapter);

    socket.on("auth", (userName) => {
        chat.loadUserMessages(userName); // Carga los mensajes del usuario al iniciar el chat
    });

    socket.on("newMessage", (data) => {
        chat.handleNewMessage(data);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
        // Realizar otras tareas o notificaciones en el servidor
    });
});
