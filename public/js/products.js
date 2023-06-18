const queryParams = new URLSearchParams(window.location.search);
const limit = queryParams.get('limit') || 10;
const page = queryParams.get('page') || 1;

const sortSelect = document.getElementById('sortSelect');

// Establecer la opción seleccionada en el elemento sortSelect
const selectedOption = queryParams.get('sort');
if (selectedOption) {
    sortSelect.value = selectedOption;
}

sortSelect.addEventListener('change', () => {
    const selectedOption = sortSelect.value;

    // Construir la cadena de consulta actualizada
    const updatedParams = new URLSearchParams(window.location.search);
    updatedParams.set('sort', selectedOption);
    const updatedQueryString = updatedParams.toString();

    // Construir la URL completa con la cadena de consulta actualizada
    const url = `${window.location.pathname}?${updatedQueryString}`;

    axios.get(url)
        .then(response => {
            const data = response.data;
            window.location = url; // Redireccionar a la URL completa
        })
        .catch(error => {
            console.error(error);
        });
});
