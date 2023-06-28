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

    // Validando campos requeridos
    if (!name || !email || !password || !age) {
        return alert('Por favor, complete todos los campos requeridos.');
    }

    const userData = {
        name,
        email,
        age,
        password,
        role,
    };

    try {
        // Registrar al usuario
        const registeredUser = await registerUser(userData);
        alert('¡Registro exitoso! ID de usuario: ' + registeredUser._id);

        // Reiniciar el formulario
        document.querySelector('#formAddUser').reset();
    } catch (error) {
        alert('Falló el registro. Error: ' + error.message);
    }
}

document.getElementById('btnAddUser').addEventListener('click', handleRegisterFormSubmit);

// Previsualizar imagen
function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('imagePreview');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}
