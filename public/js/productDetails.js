import axios from 'axios';

document
    .getElementById("qtyFrm")
    .addEventListener("submit", addProductToCart);

const productId = parseInt(document.getElementById("productId").value);


async function addProductToCart(cartId, productId, quantity) {

    //TODO: Fix this hardcoded cartId later
    const url = `http://localhost:8080/api/cart/1/prod/${productId}/${quantity}`;

    const response = axios.post(url);

    console.log(response);

}