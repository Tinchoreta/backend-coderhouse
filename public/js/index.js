
const loginBtnModal = document.getElementById('loginBtnModal');

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

async function updateCartDataView(cartId) {
    try {
        const cartItemCountElement = document.querySelector('a#myCart span');
        const cartTotalElement = document.querySelector('#myCart span:last-child');


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

    } catch (error) {
        console.error('Error al obtener datos del carrito:', error);
    }
}