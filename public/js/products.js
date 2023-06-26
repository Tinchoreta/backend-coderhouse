
const loginBtnModal = document.getElementById('loginBtnModal');


// loginBtnModal.addEventListener('click', (event) => {
//     event.preventDefault();
//     const email = document.getElementById('inputEmail').value;
//     const pass = document.getElementById('inputPassword').value;

//     if (String(email).trim() === 'tinchoreta@gmail.com' && String(pass).trim() === 'Cocohueso23') {
//         window.location = 'products';
//         sessionStorage.setItem('username', email);
//         console.log("Login Success");

//     } else {
//         alert("Invalid Credentials")
//     }
// })

document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById('sortSelect');
    const titleFilterInput = document.getElementById('titleFilter');
    const filterText = document.getElementById('filterText');
    const clearFilterButton = document.getElementById('clearFilterButton');
    const welcomeMessage = document.getElementById('welcomeMessage');

    //Obtener el usuario (email)
    const username = sessionStorage.getItem('username') || 'User';
    welcomeMessage.innerHTML = `Welcome! <strong>${username}</strong>`;
    console.log('Username:', username);


    // Obtener los parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const selectedOption = queryParams.get('sort');
    const titleFilterValue = queryParams.get('title');

    // Establecer la opción seleccionada en el elemento sortSelect
    if (selectedOption) {
        sortSelect.value = selectedOption;
    }

    // Establecer el valor del filtro de título
    if (titleFilterValue) {
        titleFilterInput.value = titleFilterValue;
        filterText.textContent = `Filtered by: ${titleFilterValue}`;
        clearFilterButton.style.display = 'inline-block';
    }

    sortSelect.addEventListener('change', () => {
        const selectedOption = sortSelect.value;
        updateQueryString('sort', selectedOption);
    });

    titleFilterInput.addEventListener('input', () => {
        const titleValue = titleFilterInput.value;
        updateQueryString('title', titleValue);
    });

    clearFilterButton.addEventListener('click', () => {
        clearFilter();
    });

    function updateQueryString(param, value) {
        const updatedParams = new URLSearchParams(window.location.search);
        if (value) {
            updatedParams.set(param, value);
            filterText.textContent = `Filtered by: ${value}`;
            clearFilterButton.style.display = 'inline-block';
        } else {
            updatedParams.delete(param);
            filterText.textContent = '';
            clearFilterButton.style.display = 'none';
        }
        const updatedQueryString = updatedParams.toString();
        const url = `${window.location.pathname}?${updatedQueryString}`;
        window.location.href = url;
    }

    function clearFilter() {
        titleFilterInput.value = '';
        updateQueryString('title', null);
    }
});
