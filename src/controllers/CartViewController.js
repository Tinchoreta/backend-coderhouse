
// import dotenv from 'dotenv';

class CartViewController {

    constructor() {
        // dotenv.config();
    }

    async renderIndex(req, res) {
        
        //TODO: Change hardcoded values on cart 1 and name to show on index page

        try {
            const cartManager = req.cartManager;
            let name = "Tincho"

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