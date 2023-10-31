const logoutBtn = document.getElementById('logoutBtn');

loginBtnModal.addEventListener('click', async (event) => {
    event.preventDefault();
    await loginUser('inputEmail', 'inputPassword');
});

loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    await loginUser('inputEmail', 'inputPassword');
});

logoutBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/api/auth/logout', true);
        xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`);

        xhr.onload = function () {
            if (xhr.status === 200) {

                sessionStorage.removeItem('username');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('cartId');

                updateUI();
                updateCartDataView("");

            } else {
                console.error('Failed to logout');
            }
        };

        xhr.onerror = function () {
            console.error('Error:', xhr.statusText);
        };

        xhr.send();
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById("qtyFrm").addEventListener("submit", function (event) {
    event.preventDefault();

    const productIdInput = document.getElementById("productId");
    const quantityInput = document.getElementById("quantity");
    const cartIdInput = document.getElementById("cartId");

    if (!productIdInput || !quantityInput || !cartIdInput) {
        console.error("One or more inputs are missing.");
        return;
    }

    retrieveCartData(cartIdInput);
    const cartId = cartIdInput.value;

    updateCartDataView(cartId);
    
    const productId = productIdInput.value;
    const quantity = parseInt(quantityInput.value);
    

    if (!productId || isNaN(quantity) || !cartId) {
        console.error("Invalid productId, quantity, or cartId.");
        return;
    }

    addProductToCart(cartId, productId, quantity);
});

async function addProductToCart(cartId, productId, quantity) {
    console.log(productId, quantity);

    const url = `http://localhost:8080/api/carts/${cartId}/product/${productId}/add/${quantity}`;

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

function retrieveCartData(cartIdInput) {

    const cartIdValue = cartIdInput.value;

    if (cartIdValue && cartIdValue.trim().length > 0) {
        console.log(`El campo cartId tiene el valor: ${cartIdValue}`);
    } else {

        const email = sessionStorage.getItem('username');

        if (email) {
            axios.get(`http://localhost:8080/api/carts/cartByUserEmail/${email}`)
                .then((response) => {
                    const cart = response.data.cart;

                    if (cart) {
                        console.log(`Carrito asociado encontrado: ${cart._id}`);
                        cartIdInput.value = cart._id;
                        sessionStorage.setItem('cartId', cart._id);
                    } else {
                        console.log("No se encontró ningún carrito asociado al usuario.");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el carrito asociado al usuario:", error);
                });
        } else {
            console.log("No se pudo obtener el email del usuario.");
        }
    }
}

async function updateCartDataView(cartId) {
    try {

        const cartItemCountElement = document.querySelector('a#myCart span');
        const cartTotalElement = document.querySelector('#myCart span:last-child');

        if (cartId && cartId.length > 0) {

            const cartItemCountURL = `http://localhost:8080/api/carts/${cartId}/cartItemCount`;
            const cartTotalURL = `http://localhost:8080/api/carts/${cartId}/cartTotal`;

            const [itemCountResponse, totalResponse] = await Promise.all([
                axios.get(cartItemCountURL),
                axios.get(cartTotalURL)
            ]);

            const itemCount = itemCountResponse?.data?.count ?? 0;
            const total = totalResponse?.data?.totalPrice ?? 0;

            // Actualiza los elementos HTML con los nuevos valores
            cartTotalElement.innerText = `$${total}`;
            cartItemCountElement.innerText = `[ ${itemCount} ] Items`;
            // cartItemCountElement.innerText = `$${total}`
        } else {
            cartTotalElement.innerText = `$0`;
            cartItemCountElement.innerText = `[ 0 ] Items`;
        }


    } catch (error) {
        console.error('Error al obtener datos del carrito:', error);
    }
}