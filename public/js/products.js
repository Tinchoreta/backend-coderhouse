const loginBtnModal = document.getElementById('loginBtnModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

async function loginUser(emailId, passwordId) {
    const email = document.getElementById(emailId).value;
    const password = document.getElementById(passwordId).value;

    try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/api/auth/signin', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`);

        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.success) {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('username', email);
                    window.location = '/products';
                    console.log("Login Success");
                } else {
                    alert("Invalid Credentials");
                }
            } else {
                console.error('Error:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Error:', xhr.statusText);
        };

        const body = JSON.stringify({ email, password });
        xhr.send(body);
    } catch (error) {
        console.error('Error:', error);
    }
}

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
                updateUI();
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

// Función para manejar el evento de agregar al carrito
async function handleAddToCartClick(event) {
    event.preventDefault();

    try {
        const cartId = document.getElementById("cartId").value;
        const productId = event.target.getAttribute("data-product-id");

        if (cartId && productId) {
            const quantity = 1;
            addProductToCart(cartId, productId, quantity);
        } else {
            console.warn("cartId o productId es nulo o indefinido.");
        }
    } catch (error) {
        console.error("Error al manejar la acción 'Agregar al carrito':", error);
    }
}

// Función para enviar una solicitud al servidor para agregar un producto al carrito
async function addProductToCart(cartId, productId, quantity) {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            showErrorMessage('Debes iniciar sesión para agregar productos al carrito.');
            return;
        }

        const url = `/api/carts/${cartId}/product/${productId}/add/${quantity}`;
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.onload = function () {
            if (xhr.status === 200) {
                showSuccessMessage('Producto agregado al carrito correctamente.');
            } else {
                showErrorMessage('Error al agregar el producto al carrito.');
            }
        };

        xhr.onerror = function () {
            console.error('Error:', xhr.statusText);
        };

        xhr.send();
    } catch (error) {
        console.error('Error:', error);
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

async function handleAddProductClick(event) {
    event.preventDefault();
    const token = sessionStorage.getItem("token");

    if (token) {
        const url = "/new_product";
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.onload = function () {
            if (xhr.status === 200) {
                const html = xhr.responseText;
                document.documentElement.innerHTML = html;
            } else if (xhr.status === 401) {
                alert("No estás autorizado a ingresar a esta opción.");
            } else {
                console.error('Error:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Error:', xhr.statusText);
        };

        xhr.send();
    } else {
        alert("No estás autorizado. Debes iniciar sesión como admin.");
    }
}



/***********************************
**
**
**     "DOMContentLoaded"
**
**
************************************/


document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById('sortSelect');
    const titleFilterInput = document.getElementById('titleFilter');
    const filterText = document.getElementById('filterText');
    const clearFilterButton = document.getElementById('clearFilterButton');

    // Agregar un controlador de eventos a todos los botones "Add to Cart"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', handleAddToCartClick);
    });

    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');
    const username = sessionStorage.getItem('username');

    const welcomeMessage = document.getElementById('welcomeMessage');
    if (email) {
        welcomeMessage.innerHTML = `Welcome! <strong>${email}</strong>`;
        sessionStorage.setItem('username', email);
    } else {
        if (username) {
            welcomeMessage.innerHTML = `Welcome! <strong>${username}</strong>`;
        } else {
            welcomeMessage.innerHTML = 'Welcome! Please log in.';
            sessionStorage.setItem('username', "");
        }

    }

    updateUI();

    sortSelect.addEventListener('change', () => {
        const selectedOption = sortSelect.value;
        updateQueryString('sort', selectedOption);
    });

    titleFilterInput.addEventListener('keydown', (event) => {
        // Comprueba si la tecla presionada es 'Enter' (código 13)
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita el comportamiento predeterminado (como enviar el formulario)
            const titleValue = titleFilterInput.value;
            updateQueryString('title', titleValue);
        }
    });

    clearFilterButton.addEventListener('click', () => {
        clearFilter();
    });

    function updateQueryString(param, value) {
        const updatedParams = new URLSearchParams(window.location.search);
        if (value) {
            updatedParams.set(param, value);
            filterText.textContent = `Filtered by: ${value}`;
            clearFilterButton.style.display = 'inline-block';
        } else {
            updatedParams.delete(param);
            filterText.textContent = '';
            clearFilterButton.style.display = 'none';
        }
        const updatedQueryString = updatedParams.toString();
        const url = `${window.location.pathname}?${updatedQueryString}`;
        window.location.href = url;
    }

    function clearFilter() {
        titleFilterInput.value = '';
        updateQueryString('title', null);
    }

});

function showSuccessMessage(message) {
    Swal.fire({
        title: 'Success',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#767e87'
    });
}

function showErrorMessage(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#767e87'
    });
}