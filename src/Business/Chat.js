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
        let user = "assistant@Bootshop.com";
        this.chats.push({
            user: user,
            message: message
        });
        if (this.conversation) {
            this.conversation.addMessage(user, message);
        }
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

            this.conversation = new Conversation(conversationData.sessionId, conversationData.user, conversationData.startTime);
            await this.conversationAdapter.saveConversation(conversationData);

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
        if (this.conversation) {
            this.conversation.addMessage(data.user, data.message);
        }
        this.processInput(this.chats);
    }

    async saveSessionAndConversation() {
        try {
            if (this.session) {
                this.session.endTime = Date.now();
                await this.sessionAdapter.saveSession(this.session);
            }

            if (this.conversation) {
                this.conversation.endConversation();

                // Guardar la conversación y obtener su ID
                const savedConversation = await this.conversationAdapter.saveConversation(this.conversation);

                // Agregar el ID de la conversación al array de conversations de la sesión
                this.session.conversations.push(savedConversation._id);

                const conversationData = {
                    sessionId: this.conversation.sessionId,
                    user: this.conversation.user,
                    startTime: this.conversation.startTime,
                    endTime: this.conversation.endTime,
                    messages: this.conversation.getAllMessages()
                };

                await Promise.all([
                    this.sessionAdapter.saveSession(this.session),
                    this.conversationAdapter.saveConversation(conversationData)
                ]);
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
        this.saveSessionAndConversation().then(() => {
            this.socket.disconnect();
        }).catch((error) => {
            console.error("Error al guardar la sesión y la conversación:", error);
            this.socket.disconnect();
        });
    }

}
export default Chat;