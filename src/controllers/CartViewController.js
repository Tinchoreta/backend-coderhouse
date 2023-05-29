
import axios from 'axios';
import dotenv from 'dotenv';
import CartManager from "../../src/Business/CartManager.js";
import DataBaseProductAdapter from "../../src/Business/DataBaseProductAdapter.js";
import DataBaseCartManagerAdapter from "../../src/Business/DataBaseCartManagerAdapter.js";

import ProductManager from '../Business/ProductManager.js';



class CartViewController {

    constructor() {

        dotenv.config();

        this.DataBaseProductAdapter = DataBaseProductAdapter.getInstance(process.env.MONGO_DB_URI);
        this.DataBaseCartAdapter = DataBaseCartManagerAdapter.getInstance(process.env.MONGO_DB_URI);
    }

    async renderIndex(req, res) {
        let cartManager;        
        //TODO: Change hardcoded values on cart 1 and name to show on index page

        try {
            const cartToRender = await this.DataBaseCartAdapter.getCartById(1);
            const productsList = await this.DataBaseProductAdapter.getProducts();
            const productManager = new ProductManager(productsList);

            cartManager = new CartManager([cartToRender],productManager);
            
            console.log(cartManager);
            
            let name = "Tincho"
            // let itemsOnCart1 = cartManager.getCartTotalItemsQuantity(1);
            // let totalPrice = cartManager.calculateTotalPrice(1);

            return res.render('index', {
                title: 'BootShop',
                user: name,
                script: 'index.js',
                cartManager: cartManager
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

export default CartViewController;