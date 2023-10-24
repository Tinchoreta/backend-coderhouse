
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
            
            window.location = '/products?email=' + email;
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getProductView(email) {
    const token = sessionStorage.getItem('token');
    try {
        // Realiza una solicitud GET a la vista de productos con el token en la cabecera
        const response = await axios.get('/products?email=' + email, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // La respuesta contiene la vista de productos o los datos necesarios
        const productView = await response.data;

        document.body.innerHTML = productView;

    } catch (error) {
        // Maneja errores
        console.error('Error al obtener la vista de productos:', error);
    }
}
