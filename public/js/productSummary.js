var minusButtons = document.querySelectorAll('.btn-minus');
var plusButtons = document.querySelectorAll('.btn-plus');
var removeButtons = document.querySelectorAll('.btn-remove');
const purchaseButton = document.querySelector('.btn-large');


purchaseButton.addEventListener('click', handlePurchaseButtonClick);

async function handlePurchaseButtonClick(event) {
  event.preventDefault();
  
  const cartId = document.getElementById('cartId').value;

  // Verifica si el carrito contiene productos
  if (cartId) {
    try {
      // Realiza una solicitud POST para procesar la compra
      const response = await axios.post(`http://localhost:8080/api/carts/${cartId}/purchase`);

      if (response.status === 200) {
        // La compra se procesó con éxito, se podría mostrar un mensaje de confirmación.
        console.log('Compra completada con éxito');

        // Actualiza la vista del resumen de productos (por ejemplo, limpiar la lista de productos).
        updateProductSummaryView();
      } else {
        console.error('Error al procesar la compra');
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
    }
  }
}


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

// Función para manejar el clic en el botón de disminuir cantidad
function handleMinusButtonClick(event) {
  var productId = event.target.getAttribute('data-product-id');
  var productElement = document.querySelector(`[data-product-id="${productId}"]`);
  var product = getProductFromCart(productId);

  if (product && product.quantity > 1) {
    product.quantity -= 1;
    // Actualizar la vista del producto
    updateProductView(product, productElement);
  }
}

// Función para manejar el clic en el botón de aumentar cantidad
function handlePlusButtonClick(event) {
  var productId = event.target.getAttribute('data-product-id');
  var productElement = document.querySelector(`[data-product-id="${productId}"]`);
  var product = getProductFromCart(productId);

  if (product && product.quantity < product.stock) {
    product.quantity += 1;
    // Actualizar la vista del producto
    updateProductView(product, productElement);
  }
}

// Función para manejar el clic en el botón de eliminar producto
function handleRemoveButtonClick(event) {
  var productId = event.target.getAttribute('data-product-id');
  // Eliminar el producto del carrito
  removeProductFromCart(productId);
  // Actualizar la vista del carrito
  updateCartView();
}

// Función para actualizar la vista de un producto
function updateProductView(product, productElement) {
  // Actualizar la cantidad en la interfaz de usuario
  var quantityElement = productElement.querySelector('.product-quantity');
  quantityElement.textContent = product.quantity;

  // Actualizar el precio total del producto (si es necesario)
  var priceElement = productElement.querySelector('.product-total-price');
  priceElement.textContent = calculateProductTotalPrice(product);

  // Aquí puedes agregar más lógica de actualización de la vista según tu HTML
}

// Ejemplo de función para calcular el precio total de un producto
function calculateProductTotalPrice(product) {
  return product.quantity * product.price;
}

// Ejemplo de función para recuperar un producto del carrito
function getProductFromCart(productId) {
  // Debes adaptar esto a la estructura de tu carrito
  // Puedes asumir que el carrito es un arreglo de productos
  return cart.find(product => product.id === productId);
}

// Ejemplo de función para eliminar un producto del carrito
function removeProductFromCart(productId) {
  // Filtrar el carrito para excluir el producto con el ID dado
  cart = cart.filter(product => product.id !== productId);
}