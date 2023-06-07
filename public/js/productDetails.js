document.getElementById("qtyFrm").addEventListener("submit", function (event) {
    event.preventDefault(); // Previene el envío del formulario

    const productId = document.getElementById("productId").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    
    // TODO: Change the hardcoded cartID
    addProductToCart('64765d546145585e447a0436', productId, quantity);
});

async function addProductToCart(cartId, productId, quantity) {
    console.log(productId, quantity);

    const url = `http://localhost:8080/api/carts/${cartId}/product/${productId}/${quantity}`;

    try {
        const response = await axios.put(url);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
