async function registerUser(userData) {
    try {
        const response = await axios.post('http://localhost:8080/api/users', userData);
        return response.data;
    } catch (error) {
        throw new Error(`Error al registrar el usuario: ${error.response.data.error}`);
    }
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();

    const name = document.querySelector('#inputName').value;
    const email = document.querySelector('#inputEmail1').value;
    const age = document.querySelector('#inputAge').value;
    const password = document.querySelector('#inputPassword1').value;
    const role = document.querySelector('#inputRole').value;

    if (!name || !email || !password || !age) {
        return Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, complete todos los campos requeridos."
        });
    }

    const userData = {
        name,
        email,
        age,
        password,
        role,
    };

    try {
        const registeredUser = await registerUser(userData);
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "¡Registro exitoso! ID de usuario: " + registeredUser.email,
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
