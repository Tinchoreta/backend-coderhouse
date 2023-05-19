class CartManager {
    constructor() {
        //cartList tiene un par {idProducto, quantity} que expresa el id del producto y la cantidad que se va a comprar
        this.cartList = [];
    }

    getCarts() {
        return this.cartList;
    };

    addCart({ productId, quantity }) {

        const newId = this.getLastId() + 1;
        this.cartList.push(newId, { productId, quantity });
        return newId;
    };

    getLastId = () => {
        const lastIndex = this.cartList.length - 1;
        return lastIndex < 0 ? 0 : this.cartList[lastIndex].id;
    };

    getCartById(cartIdToget) {
        const found = this.cartList.find((cart) => cart.id === parseInt(cartIdToget));
        if (!found) {
            return null;
        }
        return found;
    };

    removeCart(cartId) {
        const index = this.cartList.findIndex(cart => cart.id === cartId);
        if (index !== -1) {
            this.cartList.splice(index, 1);
        }
    }

    clearCartList() {
        this.cartList = [];
    }

    clearCart(cartId) {
        const cartToUpdate = this.getCartById(cartId);
        cartToUpdate.products = [];
    }

    updateCart(cartId, { productId, quantity }) {
        const cartToUpdate = this.getCartById(cartId);
        cartToUpdate.productId = productId;
        cartToUpdate.quantity = quantity;
    }

    getCartTotalQuantity(cartId) {
        const cartToCalculateTotal = this.getCartById(cartId);
        return cartToCalculateTotal.products.reduce((acc, product) => {
            return acc + product.quantity;
        }, 0);
    }

    getCartProductQuantity(cartId, productId) {
        const cartToCalculateQuantity = this.getCartById(cartId);
        const product = cartToCalculateQuantity.products.find(product => product.id === productId);
        return product ? product.quantity : 0;
    }
    async calculateTotalPrice(products) {
        try {
            let totalPrice = 0;
            for (const product of products) {
                const productData = await getProductById(product.id); // Aquí debes llamar a tu función que obtiene el producto por id
                totalPrice += productData.price * product.quantity;
            }
            return totalPrice;
        } catch (error) {
            throw new Error(`calculateTotalPrice: ${error.message}`);
        }
    }
}
export default CartManager;