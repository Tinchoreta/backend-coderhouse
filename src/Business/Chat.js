import ProductManager from "../Business/managers/ProductManager.js";
import Conversation from "./Conversation.js";

class Chat {
    constructor(socket, productAdapter, sessionAdapter, conversationAdapter) {
        this.socket = socket;
        this.isAuthenticated = false;
        this.chats = [];
        this.productAdapter = productAdapter;
        this.sessionAdapter = sessionAdapter;
        this.conversationAdapter = conversationAdapter;
        this.session = null;
        this.conversation = null;
    }

    async sendMessage(message) {
        this.chats.push({
            user: "assistant@Bootshop.com",
            message: message
        });
        // await this.saveMessageToDatabase("assistant@Bootshop.com", message);
        this.socket.emit("allMessages", this.chats);
    }

    async processInput(input) {
        const message = String(input[input.length - 1].message).toLocaleLowerCase().trim();

        if (message === "/start" && !this.isAuthenticated) {
            this.startChat();
        } else if (!this.isAuthenticated) {
            this.sendMessage("Bienvenido a Bootshop! Para comenzar, escribe '/start'");
            return;
        } else {
            this.isAuthenticated = false;
            const productAdapter = this.productAdapter;
            const products = await productAdapter.getProducts();

            switch (message) {
                case "1":
                    this.handleCheapestProduct(products);
                    break;
                case "2":
                    this.handleMostExpensiveProduct(products);
                    break;
                case "3":
                    this.sendMessage("Gracias por usar Bootshop. ¡Hasta luego!");
                    break;
                default:
                    this.sendMessage("Opción inválida. Por favor, elige una opción válida.");
                    break;
            }
        }
    }

    async startChat(userName) {
        this.isAuthenticated = true;
        if (!this.session) {
            const sessionOwner = userName; // Establecer el propietario de la sesión actual
            this.session = await this.sessionAdapter.saveSession({
                sessionOwner: sessionOwner,
                startTime: new Date()
            });

            // Crear una nueva conversación y obtener su ID
            const conversationData = {
                sessionId: this.session._id, // Obtener el ID de la sesión creada
                user: sessionOwner,
                startTime: new Date(),
                messages: []
            };

            const conversation = await this.conversationAdapter.saveConversation(conversationData);
            this.conversation = conversation;    

        }
        this.sendMessage("Elige una opción:");
        this.sendMessage("1. Ver producto más barato");
        this.sendMessage("2. Ver producto más caro");
        this.sendMessage("3. Salir");
    }

    handleCheapestProduct(products) {
        if (products.length > 0 && products) {
            const productManager = new ProductManager(products);
            const cheapestPriceProduct = productManager.getCheapestPriceProduct();
            this.sendMessage(`El producto más barato es: ${cheapestPriceProduct.title} Precio: $${cheapestPriceProduct.price}`);
        } else {
            this.sendMessage("No hay productos disponibles");
        }
    }

    handleMostExpensiveProduct(products) {
        if (products.length > 0 && products) {
            const productManager = new ProductManager(products);
            const mostExpensivePriceProduct = productManager.getMostExpensivePriceProduct();
            this.sendMessage(`El producto más caro es: ${mostExpensivePriceProduct.title} Precio: $${mostExpensivePriceProduct.price}`);
        } else {
            this.sendMessage("No hay productos disponibles");
        }
    }

    async handleNewMessage(data) {
        this.chats.push(data);
        this.conversation.addMessage(data.user, data.message);
        this.processInput(this.chats);
    }

    async saveSessionAndConversation() {
        try {
            if (this.session) {
                await this.sessionAdapter.saveSession(this.session);
            }

            if (this.conversation) {
                await this.conversationAdapter.saveConversation(this.conversation);
            }
        } catch (error) {
            console.error(`Error saving session and conversation: ${error}`);
        }
    }

    async loadUserConversations(userName) {
        try {
            const sessions = await this.sessionAdapter.getSessions();

            for (const session of sessions) {
                if (session.sessionOwner === userName) {
                    this.session = session;

                    for (const conversationId of session.conversations) {
                        const conversation = await this.conversationAdapter.getConversationById(conversationId);
                        this.chats.push(...conversation.messages);
                    }
                }
            }

            this.socket.emit("allMessages", this.chats);
        } catch (error) {
            console.error(`Error loading user conversations: ${error}`);
        }
    }


    endChat() {
        this.socket.disconnect();
        this.saveSessionAndConversation();
    }

}
export default Chat;