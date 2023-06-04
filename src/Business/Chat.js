// import DataBaseProductAdapter from "../Business/DataBaseProductAdapter.js";
import ProductManager from "../Business/managers/ProductManager.js";
// import Product from "../Business/Product.js"; 

class Chat {
    constructor(socket, productAdapter, messageAdapter) {
        this.socket = socket;
        this.isAuthenticated = false;
        this.chats = [];
        this.productAdapter = productAdapter;
        this.messageAdapter = messageAdapter;
    }

    async sendMessage(message) {
        this.chats.push({
            user: "assistant@Bootshop.com",
            message: message
        });
        await this.saveMessageToDatabase("assistant@Bootshop.com", message);
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

    startChat() {
        this.isAuthenticated = true;
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
        await this.saveMessageToDatabase(data.userName, data.message); // Persistir el mensaje en la base de datos
        this.processInput(this.chats);
    }

    async saveMessageToDatabase(userName, message) {
        const newMessage = { user: userName, message };
        await this.messageAdapter.saveMessage(newMessage);
    }

    async loadUserMessages(user) {
        try {
            const messages = await this.messageAdapter.getMessagesByUserEmail(user);
            const messagesArray = messages.map(message => ({
                user: message.user,
                message: message.message
            }));
            this.chats.push(...messagesArray);
            this.socket.emit("allMessages", this.chats);
        } catch (error) {
            console.error(`Error loading user messages: ${error}`);
        }
    }
}
export default Chat;