
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
                mail: email,
                pass: pass
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
