const loginBtnModal = document.getElementById('loginBtnModal');
// const loginBtn = document.getElementById('loginBtn');
const inputEmailModal = document.getElementById('inputEmail');
const inputPasswordModal = document.getElementById('inputPassword');
// const inputEmail = document.getElementById('inputEmail1');
// const inputPassword = document.getElementById('inputPassword1');

function handleModalLogin(event) {
    event.preventDefault();
    const email = inputEmailModal.value;
    const password = inputPasswordModal.value;
    authenticateUser(email, password);
}

// function handleLogin(event) {
//     event.preventDefault();
//     const email = inputEmail.value;
//     const password = inputPassword.value;
//     authenticateUser(email, password);
// }

loginBtnModal.addEventListener('click', handleModalLogin);
// loginBtn.addEventListener('click', handleLogin);

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
            window.location = '/products';
            console.log("Login Success");
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // const token = sessionStorage.getItem('token');
    // if (token) {
    //     fetch.setDefaultHeaders({
    //         'Authorization': `Bearer ${token}`,
    //     });
    // }
    const inputPhoto = document.getElementById('inputPhoto');
    inputPhoto.focus();
});


document.getElementById('formAddUser').addEventListener('submit', function (event) {
    event.preventDefault();

    let name = document.getElementById('inputName').value;
    let surname = document.getElementById('inputSurname').value;
    let email = document.getElementById('inputEmail1').value;
    let age = document.getElementById('inputAge').value;
    let password = document.getElementById('inputPassword1').value;
    let role = document.getElementById('inputRole').value;

    // Almacena mensajes de error
    let errors = [];

    // Validación
    if (!name) {
        errors.push('Name is required.');
    }

    if (!surname) {
        errors.push('Surname is required.');
    }

    if (!email || !email.includes('@')) {
        errors.push('Valid email is required.');
    }

    if (!age || isNaN(age) || age < 0) {
        errors.push('Valid age is required.');
    }

    if (!password) {
        errors.push('Password is required.');
    }

    if (!role) {
        errors.push('Role is required.');
    }
    // Mostrar errores o enviar formulario
    let errorBlock = document.querySelector('.alert-error');

    if (errors.length > 0) {
        errorBlock.innerHTML = '<button type="button" class="close" data-dismiss="alert">×</button><strong>Errors:</strong><br>' + errors.join('<br>');
        errorBlock.style.display = 'block';
    } else {
        errorBlock.style.display = 'none';
        console.log('Form is valid, submit data...');
    }
});

async function handleRegisterFormSubmit(event) {
    event.preventDefault();

    const name = document.querySelector('#inputName').value;
    const surname = document.querySelector('#inputSurname').value;
    const email = document.querySelector('#inputEmail1').value;
    const age = document.querySelector('#inputAge').value;
    const password = document.querySelector('#inputPassword1').value;
    const role = document.querySelector('#inputRole').value;
    const photoFile = document.querySelector('#inputPhoto').files[0];

    if (!name || !email || !password || !age || !role || !surname || !photoFile) {
        return Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, complete todos los campos requeridos."
        });
    }

    const formDataArray = {
        firstName: name,
        lastName: surname,
        email: email,
        age: age,
        password: password,
        role: role,
        photo: photoFile.name,
    };

    try {
        const registeredUser = await registerUser(formDataArray);

        if (registeredUser.success) {

            //sube la foto de perfil 
            const profileImageResponse = await uploadProfilePicture(photoFile, registeredUser.user._id)

            if (profileImageResponse.success) {
                console.log("Foto de perfil subida exitosamente: " + photoFile.name);
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "¡Registro exitoso! ID de usuario: " + registeredUser.user.email,
                    customClass: {
                        container: "my-swal-container",
                        icon: "my-swal-icon",
                        title: "my-swal-title",
                        content: "my-swal-content",
                        actions: "my-swal-actions",
                        confirmButton: "my-swal-confirm",
                    }
                });

                document.querySelector('#formAddUser').reset();
                window.location = '/products?email=' + registeredUser.user.email;
            } else {
                console.error("Error al subir la foto de perfil: " + profileImageResponse.error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Falló el registro. Error: " + registeredUser.error,
                    customClass: {
                        container: "my-swal-container",
                        icon: "my-swal-icon",
                        title: "my-swal-title",
                        content: "my-swal-content",
                        actions: "my-swal-actions",
                        confirmButton: "my-swal-confirm",
                    }
                });
            }


        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Falló el registro. Error: " + registeredUser.error,
                customClass: {
                    container: "my-swal-container",
                    icon: "my-swal-icon",
                    title: "my-swal-title",
                    content: "my-swal-content",
                    actions: "my-swal-actions",
                    confirmButton: "my-swal-confirm",
                }
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Falló el registro. Error: " + error.message,
            customClass: {
                container: "my-swal-container",
                icon: "my-swal-icon",
                title: "my-swal-title",
                content: "my-swal-content",
                actions: "my-swal-actions",
                confirmButton: "my-swal-confirm",
            }
        });
    }
}

async function registerUser(formDataArray) {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/register', formDataArray, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (response.status === 201) { //201 user created
            return response.data;
        } else {
            throw new Error('Error al registrar el usuario');
        }
    } catch (error) {
        throw new Error(`Error al registrar el usuario: ${error.message}`);
    }
}

async function uploadProfilePicture(photoFile, userId) {
    try {
        const formData = new FormData();
        formData.append('photo', photoFile);

        const response = await axios.post(`http://localhost:8080/api/users/${userId}/profile-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        return response.data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}


document.getElementById('btnAddUser').addEventListener('click', handleRegisterFormSubmit);

function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('imagePreview');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}
