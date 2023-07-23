// import dotenv from 'dotenv';
// dotenv.config({
//     path: mode === 'development' ? '.env.development' : '.env.production'
// });

import { Server } from "socket.io"
import Chat from "./Business/Chat.js"
import DataBaseProductAdapter from "./Business/adapters/DataBaseProductAdapter.js"
import { DataBaseSessionAdapter, DataBaseConversationAdapter } from "./Business/adapters/DataBaseChatAdapter.js"

import app from "./app.js"

import { config } from './config/config.js';

// dotenv.config();
console.log(config);

const PORT = config.PORT;
const ready = () => console.log(`Server ready on port: ${PORT}`)

const httpServer = app.listen(PORT, ready)
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    const productAdapter = DataBaseProductAdapter.getInstance(config.MONGO_DB_URI);
    const sessionAdapter = DataBaseSessionAdapter.getInstance(config.MONGO_DB_URI);
    const conversationAdapter = DataBaseConversationAdapter.getInstance(config.MONGO_DB_URI);
    
    const chat = new Chat(socket, productAdapter, sessionAdapter, conversationAdapter);

    socket.on("auth", (userName) => {
        chat.startChat(userName);
        chat.loadUserConversations(userName); // Carga los mensajes del usuario al iniciar el chat
    });

    socket.on("newMessage", (data) => {
        chat.handleNewMessage(data);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
        chat.endChat();
    });
});
