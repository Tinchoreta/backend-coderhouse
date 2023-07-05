const loginBtnModal = document.getElementById('loginBtnModal');
const loginBtn = document.getElementById('loginBtn');

loginBtnModal.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('inputEmail').value;
    const pass = document.getElementById('inputPassword').value;

    

    try {

        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: pass
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
});



loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('inputEmail1').value;
    const pass = document.getElementById('inputPassword1').value;
    
    console.log(email + " " + pass);

    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: pass
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
});
