
const Product = require('./Product');
const ProductManager =  require('./ProductManager');

let productAdmin = new ProductManager()
try {
    console.log("Prueba de getProducts(), debería retornar []");
    console.log(productAdmin.getProducts())
} catch (error) {
    console.error(error.message);
}

console.log("\n -------------------");

/* 
    Agrega un producto utilizando el método addProduct
*/
const prodAdmin = new ProductManager();
//id, title, description, price, thumbnail, stock
const newProduct = new Product(prodAdmin.getLastId()+1,"Producto prueba", "Este es un producto prueba",
    250,"Sin imagen",25);



try {
    prodAdmin.addProduct(newProduct);
    console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
} catch (error) {
    console.error(error.message);
}

/*
    Obtiene los productos actualizados con el método getProducts
*/
const products = prodAdmin.getProducts();

console.log(products); // [{...}]


/* Evaluar el método getProductById para obtener un producto por su id */

const productId = 1; // ID del producto a buscar y mostrar


try {
    const product = prodAdmin.getProductById(productId);
    console.log("Resultado de: getProductById(1):")
    console.log(product); // { id: 1, ...}
} catch (error) {
    console.error(error.message);
}

console.log("\n -------------------");

/* Editar un producto */

// Editar un producto existente 

const idProducto = 1; // ID del producto agregado anteriormente
const newProductProps = {
    price: 25.99,
    description: "Esta es la nueva descripción del producto",
};

try {
    const editedProduct = prodAdmin.editProduct(idProducto, newProductProps);
    console.log("Resultado de: editProduct(idProducto, newProductProps)")
    console.log(editedProduct);
} catch (error) {
    console.error(error.message);
}

console.log("\n -------------------");

/*  Eliminar un producto */

// Eliminar un producto existente
const idProductoAEliminar = 1; // ID del producto agregado anteriormente

try {
    prodAdmin.deleteProduct(idProductoAEliminar);
    console.log("Resultado de: deleteProduct(idProductoAEliminar);")
    console.log(prodAdmin.getProducts())
} catch (error) {
    console.error(error.message);
}
