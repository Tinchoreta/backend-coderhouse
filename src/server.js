import { Server } from "socket.io"
import Chat from "./Business/Chat.js"
import DataBaseProductAdapter from "./Business/adapters/DataBaseProductAdapter.js"
import { DataBaseChatSessionAdapter, DataBaseConversationAdapter } from "./Business/adapters/DataBaseChatAdapter.js"

import app from "./app.js"

import { config } from './config/config.js';

const PORT = config.PORT;
const ready = () => console.log(`Server ready on port: ${PORT}`)

const httpServer = app.listen(PORT, ready)
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    const productAdapter = DataBaseProductAdapter.getInstance(config.MONGO_DB_URI);
    const sessionAdapter = DataBaseChatSessionAdapter.getInstance(config.MONGO_DB_URI);
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
