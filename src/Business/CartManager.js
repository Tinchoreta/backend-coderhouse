class CartManager {
    constructor(cartList, productManager) {
        this.cartList = cartList;
        this.productManager = productManager;
    }

    getCarts() {
        return this.cartList;
    }

    addCart({ products }) {
        const newId = this.getLastId() + 1;
        const newCart = { id: newId, products };
        this.cartList.push(newCart);
        return newId;
    }

    getLastId() {
        const lastIndex = this.cartList.length - 1;
        return lastIndex >= 0 ? this.cartList[lastIndex].id : 0;
    }

    // getCartById(cartIdToGet) {
    //     return this.cartList.find((cart) => parseInt(cart.id) === parseInt(cartIdToGet)) || null;
    // }

    getCartById(cartIdToGet) {
        const targetCartId = parseInt(cartIdToGet);
        for (const cart of this.cartList) {
            const currentCartId = parseInt(cart.id);
            // console.log(`Checking cart with id ${currentCartId}`);
            if (currentCartId === targetCartId) {
                // console.log(`Found cart with id ${currentCartId}`);
                return cart;
            }
        }
        // console.log(`No cart found with id ${targetCartId}`);
        return null;
    }


    removeCart(cartId) {
        const index = this.cartList.findIndex((cart) => cart.id === cartId);
        if (index !== -1) {
            this.cartList.splice(index, 1);
        }
    }

    clearCartList() {
        this.cartList = [];
    }

    clearCart(cartId) {
        const cartToUpdate = this.getCartById(cartId);
        if (cartToUpdate) {
            cartToUpdate.products = [];
        }
    }

    updateCart(cartId, products) {
        const cartToUpdate = this.getCartById(cartId);
        if (cartToUpdate) {
            cartToUpdate.products = products;
        }
    }

    getCartTotalItemsQuantity(cartId) {
        const cartToCalculateTotal = this.getCartById(cartId);
        if (cartToCalculateTotal) {
            return cartToCalculateTotal.products.reduce((acc, product) => acc + product.quantity, 0);
        }
        return 0;
    }

    getProductQuantity(cartId, productId) {
        const cartToCalculateQuantity = this.getCartById(cartId);
        if (cartToCalculateQuantity) {
            const product = cartToCalculateQuantity.products.find((product) => product.productId === productId);
            return product ? product.quantity : 0;
        }
        return 0;
    }

    calculateTotalPrice(cartId) {
        try {
            const cart = this.getCartById(cartId);
            let totalPrice = 0;
            if (cart) {
                for (const item of cart.products) {
                    const productData = this.productManager.getProductById(item.productId);

                    productData ? totalPrice += productData.price * item.quantity : totalPrice = totalPrice; 
                }
            }
            return totalPrice;
        } catch (error) {
            throw new Error(`calculateTotalPrice: ${error.message}`);
        }
    }
}

export default CartManager;
