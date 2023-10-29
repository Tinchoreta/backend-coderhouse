import axios from 'axios';
// import dotenv from 'dotenv';
axios.defaults.withCredentials = true;
class CartViewController {

    constructor() {
        // dotenv.config();
    }

    async renderIndex(req, res, cartId) {

        try {
            const cartManager = req.cartManager;
            let name = "New User"

            return res.render('index', {
                title: 'BootShop',
                user: name,
                script: 'index.js',
                cartManager: cartManager,
                cartId: cartId,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    }

    async renderCart(req, res, cartId) {
        if (cartId !== undefined && cartId !== null && cartId !== "") {
            
            return res.render("cart", {
                title: "Product Summary",
                script: "productSummary.js",
                css: "productSummary.css",
                cartManager: req.cartManager,
                cartId: cartId,
            });
        }
    }

    async renderCartCheckout(req, res, cartId) {
        if (cartId !== undefined && cartId !== null && cartId !=="") {
            
            return res.render("cart", {
                title: "Product Summary",
                script: "productSummary.js",
                css: "productSummary.css",
                cartManager: req.cartManager,
                cartId: cartId,
            });
        }

    }

}

export default CartViewController;