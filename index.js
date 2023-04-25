
const Product = require('./backend/business/Product');
const ProductManager = require('./backend/business/ProductManager');
const TextFileProductAdapter = require('./backend/business/TextFileProductAdapter')


// 1 Crear una instancia de TextFileProductAdapter:
console.log("1 Crear una instancia de TextFileProductAdapter:")

const textFileAdapter = TextFileProductAdapter.getInstance("./data/data.json");

console.log("Instancia creada ✓");


console.log("\n -------------------");


async function integralTest() {
    try {
        const promises = [];
        const productsFromFile = await textFileAdapter.getProducts();
        
        if (productsFromFile.length === 0 ) {
            // 2 Agregar 10 productos al archivo solo si no existen productos en el archivo data.json
            console.log("2 Agregar 10 productos al archivo")
            for (let i = 1; i <= 10; i++) {
                const product = {
                    "title": `Producto ${i}`,
                    "description": `Descripción del producto ${i}`,
                    "price": Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    "thumbnail": `https://ejemplo.com/imagen-producto-${i}.jpg`,
                    "stock": Math.floor(Math.random() * (500 - 50 + 1)) + 50
                };
                const addedProductPromise = textFileAdapter.addProduct(product);
                const addedProductId = await addedProductPromise;
                console.log(`Producto agregado con ID ${addedProductId}`);
                promises.push(addedProductPromise);
            }
            //Espero a que se guarden todos los productos
            await Promise.all(promises);
            console.log("Todos los productos agregados correctamente");
        }
        else{
            console.log("Ya hay productos en el archivo data.json")
        }
        await testGetProducts();

        // 3 Ver el producto con ID 9:

        console.log("\n -------------------");
        console.log("3 Ver el producto con ID 9:")
        const idToTest = 9; // ID del producto a buscar y mostrar
        await testGetProductById(idToTest);

        // 4 Modificar el nombre del producto con ID 9:

        console.log("\n -------------------");
        console.log("4 Modificar el nombre del producto con ID 9:")

        const idProductToUpdate = 9;
        const newProductProps = {
            price: 25.99,
            description: "Esta es la nueva descripción del producto"
        };

        await testUpdateProduct(idProductToUpdate, newProductProps);

        // 5 Eliminar el producto con ID 10:

        console.log("\n -------------------");
        console.log("5 Eliminar el producto con ID 10:");

        const idProdToDelete = 10;
        await testDeleteProduct(idProdToDelete);

        // 6 Lista de productos luego de eliminar el producto de ID: 10

        console.log("\n -------------------");
        console.log(`6 Lista de productos luego de eliminar el producto de ID: ${idProdToDelete}`);
        await testGetProducts();

    } catch (error) {
        console.error(error.message);
    }
}

async function testGetProducts() {
    try {
        const products = await textFileAdapter.getProducts();
        console.log(products);
    } catch (error) {
        console.error(error.message);
    }
}


async function testGetProductById(productId) {
    try {
        const product = await textFileAdapter.getProductById(productId);
        console.log(`Resultado de: getProductById(${productId}):`)
        console.log(product); // { id: 10, ...}
    } catch (error) {
        console.error(error.message);
    }
}

async function testUpdateProduct(idProductToUpdate, newProductProps) {
    try {
        const editedProduct = await textFileAdapter.updateProduct(idProductToUpdate, newProductProps)
        console.log("Resultado de: updateProduct(idProducto, newProductProps)")
        console.log(editedProduct);
    } catch (error) {
        console.log(error.message)
    }
}


async function testDeleteProduct(idProductoAEliminar) {
    try {
        await textFileAdapter.deleteProduct(idProductoAEliminar);
    } catch (error) {
        console.error(error.message);
    }
}

/*Prueba integral de 6 pasos
    // 1 Crear una instancia de TextFileProductAdapter
    // 2 Agregar 10 productos al archivo
    // 3 Ver el producto con ID 9
    // 4 Modificar el nombre del producto con ID 9
    // 5 Eliminar el producto con ID 10
    // 6 Lista de productos luego de eliminar el producto de ID: 10
*/

integralTest();
