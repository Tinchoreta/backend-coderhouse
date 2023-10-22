document.getElementById("qtyFrm").addEventListener("submit", function (event) {
    event.preventDefault();

    const productIdInput = document.getElementById("productId");
    const quantityInput = document.getElementById("quantity");
    const cartIdInput = document.getElementById("cartId");

    if (!productIdInput || !quantityInput || !cartIdInput) {
        console.error("One or more inputs are missing.");
        return;
    }

    const productId = productIdInput.value;
    const quantity = parseInt(quantityInput.value);
    const cartId = cartIdInput.value;

    if (!productId || isNaN(quantity) || !cartId) {
        console.error("Invalid productId, quantity, or cartId.");
        return;
    }

    addProductToCart(cartId, productId, quantity);
});

async function addProductToCart(cartId, productId, quantity) {
    console.log(productId, quantity);

    const url = `http://localhost:8080/api/carts/${cartId}/product/${productId}/${quantity}`;

    try {
        const response = await axios.put(url);
        if (response.status === 200) {
            Swal.fire({
                title: "Product added",
                text: "Product added successfully",
                icon: "success",
                confirmButtonText: "OK",
                background: "#767e87"
            });
        }
        console.log(response);
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Product not added",
            text: `Product could not be added: ${JSON.stringify(error.response?.data?.error)}`,
            icon: "warning",
            confirmButtonText: "OK",
            background: "#767e87"
        });
    }
}
