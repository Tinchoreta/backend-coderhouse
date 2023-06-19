document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById('sortSelect');
    const titleFilterInput = document.getElementById('titleFilter');

    // Establecer la opción seleccionada en el elemento sortSelect
    const selectedOption = queryParams.get('sort');
    if (selectedOption) {
        sortSelect.value = selectedOption;
    }

    // Establecer el valor del filtro de título
    const titleFilterValue = queryParams.get('title');
    if (titleFilterValue) {
        titleFilterInput.value = titleFilterValue;
    }

    sortSelect.addEventListener('change', () => {
        const selectedOption = sortSelect.value;
        updateQueryString('sort', selectedOption);
    });

    titleFilterInput.addEventListener('input', () => {
        const titleValue = titleFilterInput.value;
        updateQueryString('title', titleValue);
    });

    function updateQueryString(param, value) {
        const updatedParams = new URLSearchParams(window.location.search);
        if (value) {
            updatedParams.set(param, value);
        } else {
            updatedParams.delete(param);
        }
        const updatedQueryString = updatedParams.toString();
        const url = `${window.location.pathname}?${updatedQueryString}`;
        window.location = url;
    }
});
