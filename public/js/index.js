
const loginBtnModal = document.getElementById('loginBtnModal');

loginBtnModal.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('inputEmail').value;
    const pass = document.getElementById('inputPassword').value;

        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: pass
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location = 'products';
                    console.log("Login Success");
                } else {
                    alert("Invalid Credentials");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

})


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
            // sessionStorage.setItem('token', data.token);
            // sessionStorage.setItem('username', email);
            window.location = '/products';
            console.log("Login Success");
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}