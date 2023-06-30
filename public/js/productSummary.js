var minusButtons = document.querySelectorAll('.btn-minus');
var plusButtons = document.querySelectorAll('.btn-plus');
var removeButtons = document.querySelectorAll('.btn-remove');

// Agrega el controlador de eventos click a cada botón
minusButtons.forEach(function (button) {
    button.addEventListener('click', handleMinusButtonClick);
});

plusButtons.forEach(function (button) {
    button.addEventListener('click', handlePlusButtonClick);
});

removeButtons.forEach(function (button) {
    button.addEventListener('click', handleRemoveButtonClick);
});

// Define las funciones para manejar los eventos de click
function handleMinusButtonClick(event) {
    var productId = event.target.getAttribute('data-product-id');
  //  TODO:  Realiza las acciones necesarias para decrementar la cantidad del producto con el ID productId
}

function handlePlusButtonClick(event) {
    var productId = event.target.getAttribute('data-product-id');
  //  TODO: Realiza las acciones necesarias para incrementar la cantidad del producto con el ID productId
}

function handleRemoveButtonClick(event) {
    var productId = event.target.getAttribute('data-product-id');
  //  TODO: Realiza las acciones necesarias para eliminar el producto con el ID productId del carrito
}