
const queryParams = new URLSearchParams(window.location.search);
const limit = queryParams.get('limit') || 10; // Valor predeterminado si no se encuentra en la URL
const page = queryParams.get('page') || 1; // Valor predeterminado si no se encuentra en la URL

const sortSelect = document.getElementById('sortSelect');

sortSelect.addEventListener('change', () => {
    const selectedOption = sortSelect.value;
    const url = `/products?limit=${limit}&page=${page}&sort=${selectedOption}`;

    axios.get(url)
        .then(response => {
            const data = response.data;
            // Redireccionar a la página actual con los parámetros de ordenamiento
            window.location = `${window.location.pathname}?limit=${limit}&page=${page}&sort=${selectedOption}`;
        })
        .catch(error => {
            console.error(error);
            // Manejar el error de la solicitud
        });
});
