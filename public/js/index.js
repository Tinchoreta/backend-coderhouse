
const loginBtnModal = document.getElementById('loginBtnModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// loginBtnModal.addEventListener('click', async (event) => {
//     event.preventDefault();
//     await loginUser('inputEmail', 'inputPassword');
// });

// loginBtn.addEventListener('click', async (event) => {
//     event.preventDefault();
//     await loginUser('inputEmail', 'inputPassword');
// });

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

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    authenticateUser(email, password);
}

loginBtnModal.addEventListener('click', handleLogin)

async function authenticateUser(email, password) {
    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', email);
            
            console.log("Login Success");

            window.location.href = '/products?email=' + email;
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
        
    const cartIdInput = document.getElementById('cartId');
    const queryParams = new URLSearchParams(window.location.search);

    const email = queryParams.get('email');
    const username = sessionStorage.getItem('username');

    retrieveCartData(cartIdInput);
    const cartId = cartIdInput?.value.length > 0 ? cartIdInput?.value : sessionStorage.getItem('cartId');

    updateCartDataView(cartId);

    updateUI();
});

function retrieveCartData(cartIdInput) {

    const cartIdValue = cartIdInput?.value;

    if (cartIdValue && cartIdValue.trim().length > 0) {
        console.log(`El campo cartId tiene el valor: ${cartIdValue}`);
    } else {

        const email = sessionStorage.getItem('username');

        if (email) {
            axios.get(`http://localhost:8080/api/carts/cartByUserEmail/${email}`)
                .then((response) => {
                    const cart = response.data?.cart;

                    if (cart && cart?._id?.length > 0) {
                        console.log(`Carrito asociado encontrado: ${cart._id}`);
                        cartIdInput.value = cart?._id;
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

        if (cartId && cartId?.length > 0) {
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
        }
    } catch (error) {
        console.error('Error al obtener datos del carrito:', error);
    }
}

function updateUI() {
    const username = sessionStorage.getItem('username');
    const loginLi = document.getElementById('loginLi');
    const logoutLi = document.getElementById('logoutLi');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (username) {
        welcomeMessage.innerHTML = `Welcome! <strong>${username}</strong>`;
        loginLi.style.display = 'none';
        logoutLi.style.display = 'block';
    } else {
        welcomeMessage.innerHTML = 'Welcome! Please log in.';
        loginLi.style.display = 'block';
        logoutLi.style.display = 'none';
    }
    
}