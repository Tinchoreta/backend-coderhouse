# Backend - Coderhouse

Este es un proyecto de ejemplo para manejar el backend de Javascript. 
Se utiliza JavaScript (ECMAScript) para el backend.
## Desafio entregable Número uno (Sprint-1)

Se verán aspectos de ECMAScript y ECMAScript avanzado.


## Instalación

1. Clonar el repositorio: `git clone https://github.com/Tinchoreta/backend-coderhouse.git`
2. Instalar las dependencias: `npm install`
3. Ejecutar el servidor: `node backend/ProductManager`

## Funciones ECMAScript

El proyecto utiliza las siguientes funciones ECMAScript:

- `findIndex`: Busca en un array el índice del primer elemento que cumple una condición especificada.
- `find`: Busca en un array el primer elemento que cumple una condición especificada.
- `splice`: Cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
- `trim`: Elimina los espacios en blanco al inicio y final de una cadena.
- `??`: Operador de fusión de nulos. Devuelve el operando de la izquierda si no es nulo, de lo contrario devuelve el operando de la derecha.

## Clase ProductManager

Cada producto constará con las propiedades:
- title (nombre del producto)
- description (descripción del producto)
- price (precio)
- thumbnail (ruta de imagen)
- id (código identificador)
- stock (número de piezas disponibles)

En la clase ProductManager se implementan métodos para manejar una lista de productos. Se utiliza un array para almacenar los productos y se definen los siguientes métodos:

-`getProducts()`: Devuelve un arreglo con todos los productos.
-`addProduct(producto)`: Agrega un nuevo producto al arreglo de productos. Si el producto ya existe, lanza un error.
-`getProductById(idProducto)`: Devuelve el producto con el id especificado. Si no existe, lanza un error.
-`editProduct(idProducto, objProductProps)`: Edita las propiedades del producto con el id especificado.
-`deleteProduct(idProducto)`: Elimina el producto con el id especificado.

## Caso de prueba

A continuación se presenta un caso de prueba para verificar el funcionamiento de la clase `ProductManager`:

## Uso
Crear una instancia de la clase ProductManager

`const productManager = new ProductManager();`
Llamar al método getProducts para obtener un arreglo vacío

`const products = productManager.getProducts();
console.log(products); //[]`

## Agrega un producto utilizando el método addProduct

`const newProduct = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  stock: 25
};`

`const prodAdmin = new ProductManager();
try{
  prodAdmin.addProduct(newProduct);
  console.log(`Producto agregado con id: ${prodAdmin.id}`);
} catch (error) {
  console.error(error.message);
}`

## Obtiene los productos actualizados con el método getProducts

`const products = prodAdmin.getProducts();

console.log(products); // [{...}]`


## Evaluar el método getProductById para obtener un producto por su id

`const productId = 1; // ID del producto a buscar y mostrar

`
try{
  const product = prodAdmin.getProductById(productId);
  console.log(product); // { id: 1, ...}
} catch (error) {
  console.error(error.message); 
}`

## Editar un producto

`editProduct(idProduct, objProductProps)`: Este método permite editar las propiedades de un producto existente. Para usar este método, necesitas pasar dos argumentos:

`idProduct (número)`: el ID del producto que deseas modificar.
`objProductProps (objeto)`: un objeto que contiene las nuevas propiedades del producto que deseas actualizar.

Ejemplo de caso de uso:


`// Editar un producto existente` 

`const idProducto = 1; // ID del producto agregado anteriormente
const newProductProps = {
  price: 25.99,
  description: "Esta es la nueva descripción del producto",
};`

`try {
  prodAdmin.editProduct(idProducto, newProductProps);
  console.log("Producto editado correctamente");
} catch (error) {
  console.error(error.message);
}`

## Eliminar un producto

`// Eliminar un producto existente
const idProductoAEliminar = 1; // ID del producto agregado anteriormente`

`try {
  prodAdmin.deleteProduct(idProductoAEliminar);
  console.log("Producto eliminado correctamente");
} catch (error) {
  console.error(error.message);
}`

¡Listo! Con estos pasos puedes verificar el correcto funcionamiento de la clase `ProductManager`. Si tienes alguna duda o pregunta, no dudes en contactarme (tinchoreta@gmail.com). ¡Gracias! 

