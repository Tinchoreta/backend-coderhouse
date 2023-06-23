
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    const email = document.getElementById('inputEmail1').value;
    const pass = document.getElementById('inputPassword1').value;

    if (String(email).trim() === 'tinchoreta@gmail.com' && String(pass).trim() === 'Cocohueso23'){
        window.location='products';
        sessionStorage.setItem('username', email);
        console.log("Login Success");

    }else{
        alert("Invalid Credentials")
    }
})

