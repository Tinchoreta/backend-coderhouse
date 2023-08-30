document.getElementById("qtyFrm").addEventListener("submit", function (event) {
    event.preventDefault(); // Previene el envío del formulario

    const productId = document.getElementById("productId").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    // TODO: Change the hardcoded cartID
    addProductToCart('64765d546145585e447a0437', productId, quantity);
});

async function addProductToCart(cartId, productId, quantity) {
    console.log(productId, quantity);

    const url = `http://localhost:8080/api/carts/${cartId}/product/${productId}/${quantity}`;

    try {
        const response = await axios.put(url);
        if (response.status === 200) {
            Swal.fire({
                title: "Product added",
                text: `Product added successfully`,
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
            text: `Product could not be added: ${JSON.stringify(error.response.data.error)}`,
            icon: "warning",
            confirmButtonText: "OK",
            background: "#767e87"
        });
    }
}
