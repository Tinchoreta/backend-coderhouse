
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
        console.log(found + " byID")

        if (found === undefined) {
            return "Not found"; //Devuelve Not Found para que el método que lo llame lo muestre por consola.
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
        console.log(objProductProps)
        // Actualizo el objeto del producto
        Object.assign(modProduct, objProductProps);
    
        // Actualizo el producto en el arreglo this.Products
        const index = this.Products.findIndex((e) => e.id === idProduct);
        this.Products[index] = modProduct;
    
        console.log(`El Producto con ID ${idProduct} ha sido modificado: ${JSON.stringify(modProduct)}`);

    }

    deleteProduct(idProduct) {
        const index = this.Products.findIndex(Product => Product.id === parseInt(idProduct));
        console.log(index)
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

let ticket = new ProductManager()

ticket.addProduct({ title: 'El libro de los unicornios', description: 'Libro de niños para colorear', price: 500, thumbnail: "img/Sally.webp", stock: 200 })
ticket.addProduct({ title: 'Sally la niña poderosa', description: 'Libro infantil - Cuento corto', price: 2500, thumbnail: "img/Sally.webp", stock: 500 })
ticket.addProduct({ title: 'Teatro visceral', description: 'Novela', price: 3500, thumbnail: "img/teatroVisceral.webp", stock: 35 })

console.log(ticket.getProducts())

ticket.deleteProduct(3)

console.log(ticket.getProducts())

ticket.editProduct(2, { id: 2, title: 'El libro de los abrazos', description: 'Literatura', price: 2600, thumbnail: "img/librodelosabrazos.webp", stock: 100 })
console.log(ticket.getProductById(2))



