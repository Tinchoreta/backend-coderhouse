
/* 

Definir una clase que se llame ProductManager, 
la cuál tendrá un arreglo de Productos que iniciará vacíos. 

*/

class ProductManager {

    constructor() {
        this.Products = []

    }

    getProducts() {

        return this.Products;
    }

    addProduct({ title, description, price, thumbnail, stock }) {

        let id = 0

        // id autoincremental, si no hay Productos le asigna 1 al id, sino le suma uno al último id creado

        id = this.getNewId();


        let Product = { id, title, description, price, thumbnail, stock }

        // console.log(Product)

        this.Products.push(Product)

    }

    getLastId() {
        if (this.Products.length === 0) {
            return 0;
        }
        else {
            let lastID = this.Products[this.Products.length - 1].id
            return lastID;
        }
    }

    getNewId() {

        let lastId = this.getLastId();
        if (lastId === 0) {
            return 1;
        }
        else {

            return ++lastId;
        }

    }

    getProductById(idProduct) {
        const found = this.Products.find(Product => Product.id === parseInt(idProduct))
        // console.log(JSON.stringify(found) + " search by ID")

        if (found === undefined) {
            console.log("Not found");
            return "Not found"; 
        } else {
            return found;
        }
    }

    editProduct(idProduct, objProductProps) {
        const modProduct = this.getProductById(idProduct);
        if (modProduct === "Not found") {
            console.log(`El Producto con ID ${idProduct} no pudo modificarse porque no se encontró`);
            return;
        }

        // Verifico si los parámetros de entrada son válidos
        const validProps = ["title", "description", "price", "thumbnail", "stock"];
        const invalidProps = Object.keys(objProductProps).filter(prop => !validProps.includes(prop));
        if (invalidProps.length > 0) {
            console.log(`Los siguientes parámetros no son válidos: ${invalidProps.join(", ")}`);

        }
        // console.log(objProductProps)
        // Actualizo el objeto del producto
        Object.assign(modProduct, objProductProps);

        // Actualizo el producto en el arreglo this.Products
        const index = this.Products.findIndex((e) => e.id === idProduct);
        this.Products[index] = modProduct;

        console.log(`El Producto con ID ${idProduct} ha sido modificado`);

    }

    deleteProduct(idProduct) {
        const index = this.Products.findIndex(Product => Product.id === parseInt(idProduct));
        
        //en el if pregunto si lo encontró, es decir si findIndex no devolvió -1
        if (index !== -1) {
            //borro el Producto con splice
            this.Products.splice(index, 1);
            console.log(`Producto con id ${idProduct} eliminado`);
        } else {
            console.error("Not found");
        }
    }
}

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


const newProduct = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    stock: 25
};


const prodAdmin = new ProductManager();
try {
    prodAdmin.addProduct(newProduct);
    console.log(`Producto agregado con id: ${prodAdmin.getLastId()}`);
} catch (error) {
    console.error(error.message);
}

console.log("\n -------------------");

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
    prodAdmin.editProduct(idProducto, newProductProps);
    console.log("Resultado de editProduct(idProducto, newProductProps);")
    console.log(prodAdmin.getProductById(idProducto))
} catch (error) {
    console.error(error.message);
}

/*  Eliminar un producto */

// Eliminar un producto existente
const idProductoAEliminar = 1; // ID del producto agregado anteriormente

try {
    prodAdmin.deleteProduct(idProductoAEliminar);
    
} catch (error) {
    console.error(error.message);
}
