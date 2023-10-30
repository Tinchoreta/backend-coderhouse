let minusButtons = document.querySelectorAll('.btn-minus');
let plusButtons = document.querySelectorAll('.btn-plus');
let removeButtons = document.querySelectorAll('.btn-remove');
const purchaseButton = document.getElementById('btnBuy');
const logoutBtn = document.getElementById('logoutBtn');

loginBtnModal.addEventListener('click', async (event) => {
  event.preventDefault();
  await loginUser('inputEmail', 'inputPassword');
});

loginBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  await loginUser('inputEmail', 'inputPassword');
});

logoutBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/api/auth/logout', true);
    xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`);

    xhr.onload = function () {
      if (xhr.status === 200) {

        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('cartId', cart._id);

        updateUI();
        updateCartDataView("");

      } else {
        console.error('Failed to logout');
      }
    };

    xhr.onerror = function () {
      console.error('Error:', xhr.statusText);
    };

    xhr.send();
  } catch (error) {
    console.error('Error:', error);
  }
});


document.addEventListener('DOMContentLoaded', () => {

  purchaseButton.addEventListener('click', handlePurchaseButtonClick);
  
  minusButtons.forEach(function (button) {
    button.addEventListener('click', (event)=>{
      event.preventDefault();
      handleMinusButtonClick(button);
    });
  });

  plusButtons.forEach(function (button) {
    button.addEventListener('click',  (event) => {
      event.preventDefault();
      handlePlusButtonClick(button);
    });
  });

  removeButtons.forEach(function  (button) {
    button.addEventListener('click',  (event) => {
      event.preventDefault();
      handleRemoveButtonClick(button);
    });
  });

  const cartIdInput = document.getElementById('cartId');

  retrieveCartData(cartIdInput);

  const cartId = cartIdInput?.value.length > 0 ? cartIdInput?.value : sessionStorage.getItem('cartId');

  updateCartDataView(cartId);

  updateUI();


});


async function handlePurchaseButtonClick(event) {
  event.preventDefault();
  
  const cartId = document.getElementById('cartId').value;

  if (cartId) {
    try {
      const response = await axios.get(`http://localhost:8080/api/carts/${cartId}/purchase`);

      if (response.status === 200) {
        // La compra se procesó con éxito, se podría mostrar un mensaje de confirmación.
        console.log('Compra completada con éxito');

        // Actualiza la vista del resumen de productos (por ejemplo, limpiar la lista de productos).
        updateProductSummaryView(response.data);
      } else {
        console.error('Error al procesar la compra');
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
    }
  }
}

function updateProductSummaryView(data){
  try {
   // const data = JSON.stringify(responseData);

    if (data && data.message === 'Compra exitosa' && data.ticket) {
      const ticket = data.ticket;
      const purchasedProducts = data.purchasedProducts;

      let message = `¡Compra exitosa!\n\n`;
      message += `Código de Ticket: ${ticket.code}\n`;
      message += `Monto: $${ticket.amount}\n`;
      message += `Fecha de Compra: ${new Date(ticket.purchase_datetime).toLocaleString()}\n`;
      message += `Comprador: ${ticket.purchaser}\n\n`;

      if (purchasedProducts && purchasedProducts.length > 0) {
        message += 'Productos Comprados:\n';
        for (const product of purchasedProducts) {
          message += `- Producto ID: ${product.productId}, Cantidad: ${product.quantity}\n`;
        }
      }

      Swal.fire({
        title: 'Detalles de la Compra',
        html: message,
        icon: 'success',
      });
    } else {
      throw new Error('La respuesta no contiene datos válidos para mostrar los detalles de la compra.');
    }
  } catch (error) {
    console.log('Error al mostrar el resumen de la compra:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron mostrar los detalles de la compra.',
      icon: 'error',
    });
  }
}

function updateUI() {
  const username = sessionStorage.getItem('username');
  const loginLi = document.getElementById('loginLi');
  const logoutLi = document.getElementById('logoutLi');
  const welcomeMessage = document.getElementById('welcomeMessage');

  if (username) {
    welcomeMessage.innerHTML = `Welcome! <strong>${username}</strong>`;
    loginLi.style.display = 'none';
    logoutLi.style.display = 'block';
  } else {
    welcomeMessage.innerHTML = 'Welcome! Please log in.';
    loginLi.style.display = 'block';
    logoutLi.style.display = 'none';
  }
  const myCartLink = document.querySelector("#myCartHead");
  // const cartItemCount = myCartLink.getAttribute("data-cart-item-count");
  // const cartTotal = myCartLink.getAttribute("data-cart-total");

  // console.log("Cart Item Count: " + cartItemCount);
  // console.log("Cart Total: " + cartTotal);
}


// Función para manejar el clic en el botón de disminuir cantidad
function handleMinusButtonClick(button) {
  const productId = button.getAttribute('data-product-id');
  const inputElement = document.getElementById(productId);

  if (inputElement) {
    let currentValue = parseInt(inputElement.value, 10);
    if (!isNaN(currentValue) && currentValue > 0) {
      currentValue -= 1;
      inputElement.value = currentValue;
    }
  }

}

// Función para manejar el clic en el botón de aumentar cantidad
function handlePlusButtonClick(button) {
  const productId = button.getAttribute('data-product-id');
  const inputElement = document.getElementById(productId);

  if (inputElement) {
    let currentValue = parseInt(inputElement.value, 10);
    if (!isNaN(currentValue) && currentValue < 5) {
      currentValue += 1;
      inputElement.value = currentValue;
    }
  }
}


function handleRemoveButtonClick(button) {
  let productId = button.getAttribute('data-product-id');
  // let cartId = sessionStorage.getItem('cartId');
  
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres quitar este producto del carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, quitarlo',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, elimina el producto del carrito
      await removeProductFromCart(productId);
      // Actualiza la vista del carrito
      // updateCartDataView(cartId);
      location.reload(true);
    }
  });
}


function updateProductView(product, productElement) {
  // Actualizar la cantidad en la interfaz de usuario
  let quantityElement = productElement.querySelector('.product-quantity');
  quantityElement.textContent = product.quantity;

  // Actualizar el precio total del producto (si es necesario)
  let priceElement = productElement.querySelector('.product-total-price');
  priceElement.textContent = calculateProductTotalPrice(product);

  
}


function calculateProductTotalPrice(product) {
  return product.quantity * product.price;
}


function getProductFromCart(productId) {

  return cart.find(product => product.id === productId);
}


async function removeProductFromCart(productId) {
  // Obtiene el cartId del almacenamiento de sesión
  const cartId = sessionStorage.getItem('cartId');

  if (!cartId) {
    console.error('No se pudo encontrar el cartId en el almacenamiento de sesión.');
    return;
  }

  // Realiza la solicitud DELETE a la API
  axios
    .delete(`/api/carts/${cartId}/product/${productId}`)
    .then((response) => {
      if (response.data.success) {
        console.log('Producto eliminado del carrito con éxito.');
      } else {
        console.error('Error al eliminar el producto del carrito:', response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error al eliminar el producto del carrito:', error);
    });
}



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
            sessionStorage.setItem('cartId', cart._id);
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

    const cartItemCountURL = `http://localhost:8080/api/carts/${cartId}/cartItemCount`;
    const cartTotalURL = `http://localhost:8080/api/carts/${cartId}/cartTotal`;

    const [itemCountResponse, totalResponse] = await Promise.all([
      axios.get(cartItemCountURL),
      axios.get(cartTotalURL)
    ]);

    const itemCount = itemCountResponse?.data?.count ?? 0;
    const total = totalResponse?.data?.totalPrice ?? 0;

    // Actualiza los elementos HTML con los nuevos valores
    cartTotalElement.innerText = `$${total}`;
    cartItemCountElement.innerText = `[ ${itemCount} ] Items`;
    // cartItemCountElement.innerText = `$${total}`
  } catch (error) {
    console.error('Error al obtener datos del carrito:', error);
  }
}