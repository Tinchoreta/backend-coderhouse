
/* 

Definir una clase que se llame ProductManager, 
la cuál tendrá un arreglo de Productos que iniciará vacíos. 

*/

class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    };

    addProduct ({ title, description, price, thumbnail, stock }) {
        if (!title || title.length === 0) {
            throw new Error('El campo título es obligatorio');
        }
        if (!description || description.length === 0) {
            throw new Error('El campo descripción es obligatorio');
        }
        if (!price || price <= 0) {
            throw new Error('El campo precio es obligatorio y debe ser mayor que cero');
        }
        if (!thumbnail || thumbnail.length === 0) {
            throw new Error('El campo imagen es obligatorio');
        }
        if (!stock || stock < 0) {
            throw new Error('El campo stock es obligatorio y no puede ser menor que cero');
        }
    
        const newId = this.getLastId() + 1;
        const newProduct = { id: newId, title, description, price, thumbnail, stock };
        this.products.push(newProduct);
        return newId;
    };

    getLastId = () => {
        const lastIndex = this.products.length - 1;
        return lastIndex < 0 ? 0 : this.products[lastIndex].id;
    };

    getProductById (idProduct) {
        const found = this.products.find((product) => product.id === parseInt(idProduct));
        if (!found) {
            throw new Error("Producto no encontrado");
        }
        return found;
    };

    editProduct(id, { title, description, price, thumbnail, stock }) {
        const product = this.getProductById(id);
        if (!product) {
            throw new Error(`Producto con ID: ${id} no encontrado`);
        }
        //en caso de que no se modifiquen todas las propiedades, se deja el valor que tenían.
        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.thumbnail = thumbnail ?? product.thumbnail;
        product.stock = stock ?? product.stock;
        return product;
    }
    deleteProduct (idProduct) {
        const productIndex = this.products.findIndex((product) => product.id === parseInt(idProduct));
        if (productIndex === -1) {
            throw new Error(`Producto con ID: ${idProduct} no encontrado`);
        }
        this.products.splice(productIndex, 1);
    };
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
    price: 250,
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
