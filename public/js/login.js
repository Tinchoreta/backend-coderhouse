// Obtener los elementos del DOM
const loginBtnModal = document.getElementById('loginBtnModal');
const loginBtn = document.getElementById('loginBtn');
const inputEmailModal = document.getElementById('inputEmail');
const inputPasswordModal = document.getElementById('inputPassword');
const inputEmail = document.getElementById('inputEmail1');
const inputPassword = document.getElementById('inputPassword1');

// Función para manejar el evento de clic en el botón de inicio de sesión del modal
function handleModalLogin(event) {
    event.preventDefault();
    const email = inputEmailModal.value;
    const password = inputPasswordModal.value;
    authenticateUser(email, password);
}

// Función para manejar el evento de clic en el botón de inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    const email = inputEmail.value;
    const password = inputPassword.value;
    authenticateUser(email, password);
}

// Asignar los controladores de eventos a los botones
loginBtnModal.addEventListener('click', handleModalLogin);
loginBtn.addEventListener('click', handleLogin);

// Función para realizar la autenticación
async function authenticateUser(email, password) {
    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem('username', email);
            window.location = '/products';
            console.log("Login Success");
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
