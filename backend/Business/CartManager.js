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
            throw new Error("Cart not found");
        }
        return found;
    };
}

export default CartManager;