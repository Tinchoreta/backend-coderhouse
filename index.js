
const Product = require('./backend/business/Product');
const ProductManager = require('./backend/business/ProductManager');
const TextFileProductAdapter = require('./backend/business/TextFileProductAdapter')


// 1 Crear una instancia de TextFileProductAdapter:
console.log("1 Crear una instancia de TextFileProductAdapter:")

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

// testGetProducts();


console.log("\n -------------------");
console.log("2 Agregar 10 productos al archivo");


// 2 Agregar 10 productos al archivo
console.log("2 Agregar 10 productos al archivo")

async function testAddProducts() {
    try {
        for (let i = 1; i <= 10; i++) {
            const product = {
                "title": `Producto ${i}`,
                "description": `Descripción del producto ${i}`,
                "price": Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                "thumbnail": `https://ejemplo.com/imagen-producto-${i}.jpg`,
                "stock": Math.floor(Math.random() * (500 - 50 + 1)) + 50
            };
            const addedProductId = await textFileAdapter.addProduct(product);
            console.log(addedProductId);
            testGetProductById(addedProductId);
        }
        } catch (error) {
            console.error(error.message);
        }
    }

testAddProducts();

// 3 Ver el producto con ID 9:

console.log("\n -------------------");
console.log("3 Ver el producto con ID 9:")

 /* Evaluar el método getProductById para obtener un producto por su id */

 const productId = 9; // ID del producto a buscar y mostrar

async function testGetProductById(idToGet) {
    try {
        const product = await textFileAdapter.getProductById(idToGet);
        console.log(`Resultado de: getProductById(${idToGet}):`)
        console.log(product); // { id: 10, ...}
    } catch (error) {
        console.error(error.message);
    }
}

testGetProductById(productId);


// 4 Modificar el nombre del producto con ID 9:

console.log("\n -------------------");
console.log("4 Modificar el nombre del producto con ID 9:")


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

testUpdateProduct();

// 5 Eliminar el producto con ID 10:

console.log("\n -------------------");
console.log("5 Eliminar el producto con ID 10:");

const idProductoAEliminar = 10; // ID del producto agregado anteriormente
async function testDeleteProduct(){
    try {
        prodAdmin.deleteProduct(idProductoAEliminar);
        console.log("Resultado de: deleteProduct(idProductoAEliminar);")
        //Debería traer los productos con ID del 1 al 9.
        console.log(prodAdmin.getProducts())
    } catch (error) {
        console.error(error.message);
    }
}

testDeleteProduct()