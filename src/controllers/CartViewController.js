import axios from 'axios';
import CartManager from "../../src/Business/CartManager.js";
import TextFileProductAdapter from "../../src/Business/TextFileProductAdapter.js";
import TextFileCartManagerAdapter from "../../src/Business/TextFileCartManagerAdapter.js";
import ProductManager from '../Business/ProductManager.js';


class CartViewController {

    constructor() {

        const pathToCart = "./data/carts.json";
        const pathToProduct = "./data/products.json";

        this.textFileProductAdapter = TextFileProductAdapter.getInstance(pathToProduct);

        this.textFileCartAdapter = TextFileCartManagerAdapter.getInstance(pathToCart);
    }

    async renderIndex(req, res) {
        
        //TODO: Change hardcoded values on cart 1 and name to show on index page

        try {
            const cartToRender = await textFileCartAdapter.getCartById(1);
            const productsList = await textFileCartAdapter.getProducts();

            let cartManager = new CartManager(cartToRender,productsList);
            
            let name = "Tincho"
            let itemsOnCart = cartManager.getItems;
            let totalPrice = cartManager.calculateTotalPrice(1);

            return res.render('index', {
                title: 'BootShop',
                user: name,
                itemsOnCart1: itemsOnCart,
                totalPrice: totalPrice
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    }

}