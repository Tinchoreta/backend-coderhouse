import DataBaseProductAdapter from "../Business/DataBaseProductAdapter.js";
import ProductManager from "../Business/managers/ProductManager.js";
// import Product from "../Business/Product.js"; 

class Chat {
    constructor(socket) {
        this.socket = socket;
        this.isAuthenticated = false;
        this.chats = [];
    }

    sendMessage(message) {
        this.chats.push({
            userName: "Bootshop",
            message: message
        });

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
            const productAdapter = DataBaseProductAdapter.getInstance(process.env.MONGO_DB_URI);
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

    handleNewMessage(data) {
        this.chats.push(data);
        this.processInput(this.chats);
    }
}

export default Chat;