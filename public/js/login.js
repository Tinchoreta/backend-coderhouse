
const loginBtnModal = document.getElementById('loginBtnModal');
const loginBtn = document.getElementById('loginBtn');

loginBtnModal.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('inputEmail').value;
    const pass = document.getElementById('inputPassword').value;

    if (String(email).trim() === 'tinchoreta@gmail.com' && String(pass).trim() === 'Cocohueso23') {
        // Aquí se hace un request al servidor para iniciar la sesión
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, pass }),
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
    } else {
        alert("Invalid Credentials")
    }
})

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('inputEmail1').value;
    const pass = document.getElementById('inputPassword1').value;

    if (String(email).trim() === 'tinchoreta@gmail.com' && String(pass).trim() === 'Cocohueso23') {
        // Aquí se hace un request al servidor para iniciar la sesión
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, pass }),
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
    } else {
        alert("Invalid Credentials")
    }
})
