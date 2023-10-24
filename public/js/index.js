
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

