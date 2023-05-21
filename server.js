import app from "./app.js"
import { Server } from "socket.io"
import TextFileProductAdapter from "./src/Business/TextFileProductAdapter.js"
import ProductManager from "./src/Business/ProductManager.js"
import Product from "./src/Business/Product.js"

const PORT = 8080
const ready = () => console.log(`Server ready on port: ${PORT}`)

const httpServer = app.listen(PORT, ready)
const socketServer = new Server(httpServer);

const chats = [];

socketServer.on("connection", (socket) => {
    let isAuthenticated = false;

    const sendMessage = (message) => {

        chats.push({
            userName: "Bootshop",
            message: message
        });
        // console.log(chats);

        socket.emit("allMessages", chats);
    };

    const processInput = async (input) => {
        
        const message = String(input[input.length-1].message).toLocaleLowerCase().trim();

        // console.log(message);
        // console.log(isAuthenticated);

        if (message === "/start" && !isAuthenticated) {
           // console.log(message + " is authenticated");
            isAuthenticated = true;
            sendMessage("Elige una opción:");
            sendMessage("1. Ver producto más barato");
            sendMessage("2. Ver producto más caro");
            sendMessage("3. Salir");
        } else if (!isAuthenticated) {
            sendMessage("Bienvenido a Bootshop! Para comenzar, escribe '/start'");
            return;

        } else {
            isAuthenticated = false;
            // console.log(message + "numero " + typeof (message));
            let productAdapter = TextFileProductAdapter.getInstance(
              "./data/products.json"
            );
            let products = await productAdapter.getProducts();

            switch (message) {
                case "1":
                    
                    
                    // console.log(products[0].description + " product");
                    if (products.length > 0 && products) {
                        let productManager = new ProductManager(products);
                        // console.log(productManager.getProducts());
                        let cheapestPriceProduct = new Product();
                        cheapestPriceProduct = productManager.getCheapestPriceProduct();
                        let prod = cheapestPriceProduct.toString();
                        prod = JSON.stringify(prod);
                        console.log(prod);
                        sendMessage(
                        "El producto más barato es: " +
                          cheapestPriceProduct.title + " Precio: $" + cheapestPriceProduct.price);
                    } else {
                        sendMessage("No hay productos disponibles");
                        break;
                    }
                    break;
                case "2":
                    
                       products = await productAdapter.getProducts();
                    // console.log(products[0].description + " product");
                    if (products.length > 0 && products) {
                        let productManager = new ProductManager(products);
                        // console.log(productManager.getProducts());
                        let mostExpensivePriceProduct = new Product();
                        mostExpensivePriceProduct =
                          productManager.getMostExpensivePriceProduct();
                        sendMessage(
                          "El producto más caro es: " +
                            mostExpensivePriceProduct.title +
                            " Precio: $" +
                            mostExpensivePriceProduct.price
                        );
                    } else {
                        sendMessage("No hay productos disponibles");
                        break;
                    }
                    break;
                    
                    break;
                case "3":
                    sendMessage("Gracias por usar Bootshop. ¡Hasta luego!");
                    
                    break;
                default:
                    sendMessage("Opción inválida. Por favor, elige una opción válida.");
                    break;
            }
        }
};


    socket.on("newMessage", (data) => {
        chats.push(data)
        processInput(chats);
    });
});


    //agregar recepcion de la autenticacion
        //en la practica debe emitir los mensajes de la memoria
        //en la entrega debe enviar las opciones del chatbot que crean necesarias
    //agregar recepcion del nuevo mensaje
        //en la práctica debe enviar los mensajes de la memoria
        //para la entrega debe emitir una respuesta
