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
            const cartToRender = await this.textFileCartAdapter.getCartById(1);
            const productsList = await this.textFileProductAdapter.getProducts();
            const productManager = new ProductManager(productsList);

            let cartManager = new CartManager([cartToRender],productManager);
            
            let name = "Tincho"
            let itemsOnCart1 = cartManager.getCartTotalItemsQuantity(1);
            let totalPrice = cartManager.calculateTotalPrice(1);

            return res.render('index', {
                title: 'BootShop',
                user: name,
                itemsOnCart1: itemsOnCart1,
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

export default CartViewController;