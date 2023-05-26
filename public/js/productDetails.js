document.getElementById("qtyFrm").addEventListener("submit", function (event) {
    event.preventDefault(); // Previene el envío del formulario

    const productId = parseInt(document.getElementById("productId").value);
    const quantity = parseInt(document.getElementById("quantity").value);

    addProductToCart(1, productId, quantity);
});

async function addProductToCart(cartId, productId, quantity) {
    console.log(productId, quantity);
    // TODO: Corregir el cartId codificado después
    const url = `http://localhost:8080/api/carts/1/product/${productId}/${quantity}`;

    try {
        const response = await axios.put(url);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
