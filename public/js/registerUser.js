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

async function registerUser(userData) {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(`Error al registrar el usuario: ${error.response.data.error}`);
    }
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();

    const name = document.querySelector('#inputName').value;
    const surname = document.querySelector('#inputSurname').value;
    const email = document.querySelector('#inputEmail1').value;
    const age = document.querySelector('#inputAge').value;
    const password = document.querySelector('#inputPassword1').value;
    const role = document.querySelector('#inputRole').value;

    if (!name || !email || !password || !age || !role || !surname) {
        return Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, complete todos los campos requeridos."
        });
    }

    const userData = {
        firstName: name,
        lastName: surname,
        email: email,
        age: age,
        password: password,
        role: role,
    };

    try {
        const registeredUser = await registerUser(userData);
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
            },
        });

        document.querySelector('#formAddUser').reset();
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
            },
        });
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
