
const Product = require('./backend/Business/Product');
const ProductManager = require('./backend/Business/ProductManager');
const ProductAdapter = require('./backend/Business/ProductAdapter');



const productAdapter = ProductAdapter.getInstance("./data/data.json");

async function testGetProducts() {
    try {
        console.log("Prueba de getProducts()");
        const products = await productAdapter.getProducts();
        console.log(products);
    } catch (error) {
        console.error(error.message);
    }
}

testGetProducts();


const prodAdmin = new ProductManager()
// try {
//     console.log("Prueba de getProducts(), debería retornar []");
//     console.log(prodAdmin.getProducts())
// } catch (error) {
//     console.error(error.message);
// }

console.log("\n -------------------");

/* 
    Agrega un producto utilizando el método addProduct
*/

//id, title, description, price, thumbnail, stock
const newProduct = new Product(prodAdmin.getLastId()+1,"Producto prueba", "Este es un producto prueba",
    250,"Sin imagen",25);

const productoUno = new Product(prodAdmin.getLastId()+1, "Gel refrescante", "Gel para el cuidado de la piel", 150, "https://imagen.com/gelrefrescante", 15);
const productoDos = new Product(prodAdmin.getLastId()+1, "Aceite esencial", "Aceite para aromaterapia", 200, "https://imagen.com/aceiteesencial", 20);
const productoTres = new Product(prodAdmin.getLastId()+1, "Crema hidratante", "Crema para el cuidado de la piel seca", 300, "https://imagen.com/cremahidratante", 30);
const productoCuatro = new Product(prodAdmin.getLastId()+1, "Mascarilla facial", "Mascarilla para el cuidado de la piel", 100, "https://imagen.com/mascarillafacial", 10);
const productoCinco = new Product(prodAdmin.getLastId()+1, "Serum revitalizante", "Serum para el cuidado de la piel cansada", 400, "https://imagen.com/serumrevitalizante", 40);


async function testAddProducts() {
    try {
        console.log("Prueba de AddProducts(), debería retornar el id");
        const products = await productAdapter.addProduct(newProduct);
        console.log(products);
    } catch (error) {
        console.error(error.message);
    }
}

testAddProducts();


// try {
//     prodAdmin.addProduct(newProduct);
//     console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
// } catch (error) {
//     console.error(error.message);
// }

// try {
//     prodAdmin.addProduct(productoUno);
//     console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
//     } catch (error) {
//     console.error(error.message);
//     }
    
//     try {
//     prodAdmin.addProduct(productoDos);
//     console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
//     } catch (error) {
//     console.error(error.message);
//     }
    
//     try {
//     prodAdmin.addProduct(productoTres);
//     console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
//     } catch (error) {
//     console.error(error.message);
//     }
    
//     try {
//     prodAdmin.addProduct(productoCuatro);
//     console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
//     } catch (error) {
//     console.error(error.message);
//     }
    
//     try {
//     prodAdmin.addProduct(productoCinco);
//     console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
//     } catch (error) {
//     console.error(error.message);
//     }

// /*
//     Obtiene los productos actualizados con el método getProducts
// */
// const products = prodAdmin.getProducts();

// console.log(products); // [{...}]


// /* Evaluar el método getProductById para obtener un producto por su id */

// const productId = 1; // ID del producto a buscar y mostrar


// try {
//     const product = prodAdmin.getProductById(productId);
//     console.log("Resultado de: getProductById(1):")
//     console.log(product); // { id: 1, ...}
// } catch (error) {
//     console.error(error.message);
// }

// console.log("\n -------------------");

// /* Editar un producto */

// // Editar un producto existente 

// const idProducto = 1; // ID del producto agregado anteriormente
// const newProductProps = {
//     price: 25.99,
//     description: "Esta es la nueva descripción del producto",
// };

// try {
//     const editedProduct = prodAdmin.editProduct(idProducto, newProductProps);
//     console.log("Resultado de: editProduct(idProducto, newProductProps)")
//     console.log(editedProduct);
// } catch (error) {
//     console.error(error.message);
// }

// console.log("\n -------------------");

// /*  Eliminar un producto */

// // Eliminar un producto existente
// const idProductoAEliminar = 1; // ID del producto agregado anteriormente

// try {
//     prodAdmin.deleteProduct(idProductoAEliminar);
//     console.log("Resultado de: deleteProduct(idProductoAEliminar);")
//     console.log(prodAdmin.getProducts())
// } catch (error) {
//     console.error(error.message);
// }
