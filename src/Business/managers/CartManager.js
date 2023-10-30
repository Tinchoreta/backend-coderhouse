class CartManager {
    constructor(cartList, productManager) {
        this.cartList = cartList;
        this.productManager = productManager;
    }

    static instance = null;

    static getInstance(cartList, productManager) {
        if (!CartManager.instance) {
            CartManager.instance = new CartManager(cartList, productManager);
        }
        return CartManager.instance;
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

    // getCartById(cartIdToGet) {
    //     const targetCartId = cartIdToGet;

    //     if (!targetCartId) {
    //         throw new Error('El ID del carrito no está definido.');
    //     }

    //     const foundCart = this.cartList.find((cart) => {
    //         if (cart?._id){

    //             return cart?._id?.toString() === targetCartId;
    //         }

    //         if (cart?._doc?._id){
    //             return cart?._doc?._id?.toString() === targetCartId;
    //         }

    //         return undefined;

    //     });

    //     // Si se encuentra el carrito, lo retornas; de lo contrario, puedes lanzar una excepción o devolver undefined.
    //     if (foundCart) {
    //         return foundCart;
    //     }

    //     // throw new Error(`No se encontró ningún carrito con el ID ${targetCartId}.`);
    //     return undefined;
    // }

    getCartById(cartIdToGet) {
        const targetCartId = cartIdToGet;

        if (!targetCartId) {
            return undefined; 
        }

        for (let i = 0; i < this.cartList.length; i++) {
            const cart = this.cartList[i];
            if (cart?._id && cart?._id.toString() === targetCartId) {
                return cart;
            }
            if (cart?._doc?._id && cart?._doc?._id.toString() === targetCartId) {
                return cart;
            }
        }
        return undefined;
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

    getProducts(cartId) {
        const cart = this.getCartById(cartId);
        if (cart) {
            const products = [];
            if (cart.products?.length > 0) {

                for (const item of cart.products) {
                    const productData = this.productManager.getProductById(item.productId);
                    if (productData) {
                        const { _id, title, description, price, thumbnail, stock } = productData;
                        const product = {
                            _id,
                            title,
                            price,
                            description,
                            thumbnail,
                            stock,
                            quantity: item.quantity
                        };
                        products.push(product);
                    }
                }
                return products;
            }
            if (cart._doc?.products?.length > 0) {

                for (const item of cart._doc.products) {
                    const productData = this.productManager.getProductById(item.productId);
                    if (productData) {
                        const { _id, title, description, price, thumbnail, stock } = productData;
                        const product = {
                            _id,
                            title,
                            price,
                            description,
                            thumbnail,
                            stock,
                            quantity: item.quantity
                        };
                        products.push(product);
                    }
                }
                return products;
            }
            return products;
        }
        return [];
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
