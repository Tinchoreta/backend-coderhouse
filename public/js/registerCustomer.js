async function registerCustomer(customerData) {
    try {
        const response = await axios.post('http://localhost:8080/api/customers', customerData);
        return response.data;
    } catch (error) {
        throw new Error(`Error registering customer: ${error.response.data.error}`);
    }
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();

    
    const title = document.querySelector('#inputTitle').value;
    const firstName = document.querySelector('#inputFname1').value;
    const lastName = document.querySelector('#inputLnam').value;
    const email = document.querySelector('#input_email').value;
    const password = document.querySelector('#inputPassword1').value;
    const dateOfBirth = buildDateOfBirth(); 
    const address = buildAddress(); 

    
    if (!title || !firstName || !lastName || !email || !password || !dateOfBirth || !address) {
        return alert('Please fill in all required fields.');
    }
    
    const customerData = {
        title,
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        addresses: buildAddress(),
    };


    try {
        // Registrar el cliente
        const registeredCustomer = await registerCustomer(customerData);
        alert('Registration successful! Customer ID: ' + registeredCustomer._id);

        // Restablecer el formulario
        document.querySelector('form').reset();
    } catch (error) {
        alert('Registration failed. Error: ' + error.message);
    }
}

function buildDateOfBirth() {
    const day = document.querySelector('#inputDay').value;
    const month = document.querySelector('#inputMonth').value;
    const year = document.querySelector('#inputYear').value;

    // Validar los valores (agrega tus propias validaciones según tus requisitos)
    if (!day || !month || !year) {
        throw new Error('Invalid date of birth');
    }

    // Construir la fecha de nacimiento en el formato deseado
    const dateOfBirth = `${year}-${month}-${day}`;

    return dateOfBirth;
}

function buildAddress() {
    const firstName = document.querySelector('#inputFname').value;
    const lastName = document.querySelector('#inputLname').value;
    const company = document.querySelector('#company').value;
    const addressLine1 = document.querySelector('#address').value;
    const addressLine2 = document.querySelector('#address2').value;
    const city = document.querySelector('#city').value;
    const state = document.querySelector('#state').value;
    const postalCode = document.querySelector('#postcode').value;
    const country = document.querySelector('#country').value;
    const additionalInfo = document.querySelector('#aditionalInfo').value;
    const phone = document.querySelector('#phone').value;
    const mobilePhone = document.querySelector('#mobile').value;

    // Validar los valores (agrega tus propias validaciones según tus requisitos)
    if (!firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
        throw new Error('Invalid address');
    }

    // Construir el objeto de dirección
    const addressData = {
        firstName,
        lastName,
        company,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        additionalInfo,
        phone,
        mobilePhone,
    };

    return [addressData];
}


document.getElementById('btnAddCustomer').addEventListener('click', handleRegisterFormSubmit);


// document.addEventListener("DOMContentLoaded", function () {
//     const selectElements = document.querySelectorAll(".select2");

//     selectElements.forEach(function (selectElement) {
//         new Select2(selectElement);
//     });
// });
