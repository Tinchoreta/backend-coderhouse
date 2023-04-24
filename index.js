
const Product = require('./backend/business/Product');
const ProductManager = require('./backend/business/ProductManager');
const TextFileProductAdapter = require('./backend/business/TextFileProductAdapter')


// 1 Crear una instancia de TextFileProductAdapter:

const textFileAdapter = TextFileProductAdapter.getInstance("./data/data.json");

async function testGetProducts() {
    try {
        console.log("Prueba de getProducts()");
        const products = await textFileAdapter.getProducts();
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

const productoUno = new Product(prodAdmin.getLastId()+1, "Gel refrescante", "Gel para el cuidado de la piel", 150, "https://imagen.com/gelrefrescante", 15);
const productoDos = new Product(prodAdmin.getLastId()+1, "Aceite esencial", "Aceite para aromaterapia", 200, "https://imagen.com/aceiteesencial", 20);
const productoTres = new Product(prodAdmin.getLastId()+1, "Crema hidratante", "Crema para el cuidado de la piel seca", 300, "https://imagen.com/cremahidratante", 30);
const productoCuatro = new Product(prodAdmin.getLastId()+1, "Mascarilla facial", "Mascarilla para el cuidado de la piel", 100, "https://imagen.com/mascarillafacial", 10);
const productoCinco = new Product(prodAdmin.getLastId()+1, "Serum revitalizante", "Serum para el cuidado de la piel cansada", 400, "https://imagen.com/serumrevitalizante", 40);


async function testAddProducts() {
    try {
        console.log("Prueba de AddProducts(), debería retornar el id");
        const productoUnoId = await textFileAdapter.addProduct(productoUno);
        productoUnoId? console.log(`Se agregó el producto con ID:  ${productoUnoId}`): console.log(`No se pudo agregar: ${newProduct}`);

        const productoDosId = await textFileAdapter.addProduct(productoDos);
        productoDosId? console.log(`Se agregó el producto con ID:  ${productoDosId}`): console.log(`No se pudo agregar: ${newProduct}`);

        const productoTresId = await textFileAdapter.addProduct(productoTres);
        productoTresId? console.log(`Se agregó el producto con ID:  ${productoTresId}`): console.log(`No se pudo agregar: ${newProduct}`);

        const productoCuatroId = await textFileAdapter.addProduct(productoCuatro);
        productoCuatroId? console.log(`Se agregó el producto con ID:  ${productoCuatroId}`): console.log(`No se pudo agregar: ${newProduct}`);

        const productoCincoId = await textFileAdapter.addProduct(productoCinco);
        productoCincoId? console.log(`Se agregó el producto con ID:  ${productoCincoId}`): console.log(`No se pudo agregar: ${newProduct}`);

        
     //   testGetProducts();

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
//     prodAdmin.addProduct(productoCinco);
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


 /* Evaluar el método getProductById para obtener un producto por su id */

 const productId = 10; // ID del producto a buscar y mostrar

async function testGetById() {
    try {
        const product = await textFileAdapter.getProductById(productId);
        console.log("Resultado de: getProductById(10):")
        console.log(product); // { id: 1, ...}
    } catch (error) {
        console.error(error.message);
    }
}

testGetById();

console.log("\n -------------------");

/* Editar un producto */

// Editar un producto existente 

const idProducto = 1; // ID del producto agregado anteriormente
const newProductProps = {
    price: 25.99,
    description: "Esta es la nueva descripción del producto",
};

async function testUpdateProduct(){
    try {
        const editedProduct = await prodAdapter.updateProduct(idProducto,newProductProps) 
        console.log("Resultado de: updateProduct(idProducto, newProductProps)")
        console.log(editedProduct);
    } catch (error) {
        console.log(error.message)
    }
}

// try {
//     const editedProduct = prodAdmin.updateProduct(idProducto, newProductProps);
//     console.log("Resultado de: updateProduct(idProducto, newProductProps)")
//     console.log(editedProduct);
// } catch (error) {
//     console.error(error.message);
// }

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
