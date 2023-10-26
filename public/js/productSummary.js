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


document.getElementById("qtyFrm").addEventListener("submit", function (event) {
  event.preventDefault();

  const productIdInput = document.getElementById("productId");
  const quantityInput = document.getElementById("quantity");
  const cartIdInput = document.getElementById("cartId");

  if (!productIdInput || !quantityInput || !cartIdInput) {
    console.error("One or more inputs are missing.");
    return;
  }

  retrieveCartData(cartIdInput);
  const cartId = cartIdInput.value;

  updateCartDataView(cartId);

  const productId = productIdInput.value;
  const quantity = parseInt(quantityInput.value);


  if (!productId || isNaN(quantity) || !cartId) {
    console.error("Invalid productId, quantity, or cartId.");
    return;
  }

  addProductToCart(cartId, productId, quantity);
});

async function addProductToCart(cartId, productId, quantity) {
  console.log(productId, quantity);

  const url = `http://localhost:8080/api/carts/${cartId}/product/${productId}/add/${quantity}`;

  try {
    const response = await axios.put(url);
    if (response.status === 200) {
      Swal.fire({
        title: "Product added",
        text: "Product added successfully",
        icon: "success",
        confirmButtonText: "OK",
        background: "#767e87"
      });
    }
    console.log(response);
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Product not added",
      text: `Product could not be added: ${JSON.stringify(error.response?.data?.error)}`,
      icon: "warning",
      confirmButtonText: "OK",
      background: "#767e87"
    });
  }
}

function retrieveCartData(cartIdInput) {

  const cartIdValue = cartIdInput.value;

  if (cartIdValue && cartIdValue.trim().length > 0) {
    console.log(`El campo cartId tiene el valor: ${cartIdValue}`);
  } else {

    const email = sessionStorage.getItem('username');

    if (email) {
      axios.get(`http://localhost:8080/api/carts/cartByUserEmail/${email}`)
        .then((response) => {
          const cart = response.data.cart;

          if (cart) {
            console.log(`Carrito asociado encontrado: ${cart._id}`);
            cartIdInput.value = cart._id;
          } else {
            console.log("No se encontró ningún carrito asociado al usuario.");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el carrito asociado al usuario:", error);
        });
    } else {
      console.log("No se pudo obtener el email del usuario.");
    }
  }
}

async function updateCartDataView(cartId) {
  try {

    const cartItemCountElement = document.querySelector('a#myCart span');
    const cartTotalElement = document.querySelector('#myCart span:last-child');


    const [itemCountResponse, totalResponse] = await Promise.all([
      axios.get(cartItemCountURL),
      axios.get(cartTotalURL)
    ]);

    const itemCount = itemCountResponse?.data?.count ?? 0;
    const total = totalResponse?.data?.totalPrice ?? 0;

    // Actualiza los elementos HTML con los nuevos valores
    cartTotalElement.innerText = `$${total}`;
    cartItemCountElement.innerText = `[ ${itemCount} ] Items`;

  } catch (error) {
    console.error('Error al obtener datos del carrito:', error);
  }
}