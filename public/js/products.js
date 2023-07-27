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

document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById('sortSelect');
    const titleFilterInput = document.getElementById('titleFilter');
    const filterText = document.getElementById('filterText');
    const clearFilterButton = document.getElementById('clearFilterButton');

    const addProductLink = document.getElementById("addProductLink");
    addProductLink.addEventListener("click", handleAddProductClick);

    updateUI();

    sortSelect.addEventListener('change', () => {
        const selectedOption = sortSelect.value;
        updateQueryString('sort', selectedOption);
    });

    titleFilterInput.addEventListener('input', () => {
        const titleValue = titleFilterInput.value;
        updateQueryString('title', titleValue);
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
