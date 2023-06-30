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
        return Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please fill in all required fields.",
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
        const registeredCustomer = await registerCustomer(customerData);
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Registration successful! Customer ID: " + registeredCustomer._id,
            customClass: {
                container: "my-swal-container",
                icon: "my-swal-icon",
                title: "my-swal-title",
                content: "my-swal-content",
                actions: "my-swal-actions",
                confirmButton: "my-swal-confirm",
            },
        });

        document.querySelector('form').reset();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Registration failed. Error: " + error.message,
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
