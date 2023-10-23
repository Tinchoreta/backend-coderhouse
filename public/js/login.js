const loginBtnModal = document.getElementById('loginBtnModal');
const loginBtn = document.getElementById('loginBtn');
const inputEmailModal = document.getElementById('inputEmail');
const inputPasswordModal = document.getElementById('inputPassword');
const inputEmail = document.getElementById('inputEmail1');
const inputPassword = document.getElementById('inputPassword1');

function handleModalLogin(event) {
    event.preventDefault();
    const email = inputEmailModal.value;
    const password = inputPasswordModal.value;
    authenticateUser(email, password);
}

function handleLogin(event) {
    event.preventDefault();
    const email = inputEmail.value;
    const password = inputPassword.value;
    authenticateUser(email, password);
}

loginBtnModal.addEventListener('click', handleModalLogin);
loginBtn.addEventListener('click', handleLogin);

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
            window.location = '/products?email='+ email;
            console.log("Login Success");
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
