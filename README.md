# Backend - Coderhouse

Este es un proyecto de ejemplo para manejar el backend de Javascript. 
Se utiliza JavaScript (ECMAScript) para el backend.
## Desafio entregable Número uno (Sprint-1)

Se verán aspectos de ECMAScript y ECMAScript avanzado.


## Instalación

1. Clonar el repositorio: `git clone https://github.com/Tinchoreta/backend-coderhouse.git`
2. Instalar las dependencias: `npm install`
3. Ejecutar el servidor: `node hol_02.js`

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


## Caso de prueba

A continuación se presenta un caso de prueba para verificar el funcionamiento de la clase `ProductManager`:

Uso
Crear una instancia de la clase ProductManager

`const productManager = new ProductManager();`
Llamar al método getProducts para obtener un arreglo vacío

`const products = productManager.getProducts();
console.log(products); //[]`

Agrega un producto utilizando el método addProduct

`const newProduct = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
};`

`try{
  const productId = productManager.addProduct(newProduct);
  console.log(``Producto agregado con id: ${productId}``);
} catch (error) {
  console.error(error.message);
}`

Obtiene los productos actualizados con el método getProducts

`const products = productManager.getProducts();
console.log(products); // [{...}]`

Intentar agregar un producto con un código repetido debe arrojar un error

`const newProduct2 = {
  title: "producto prueba 2",
  description: "Este es un producto prueba 2",
  price: 300,
  thumbnail: "Sin imagen",
  code: "abc123", // Código repetido
  stock: 30
};`

`try{
  const productId = productManager.addProduct(newProduct2);
  console.log(``Producto agregado con id: ${productId}``);
} catch (error) {
  console.error(error.message); // "El código del producto ya existe"
}`

Evaluar el método getProductById para obtener un producto por su id

`const productId = 1; // ID del producto agregado anteriormente`

`try{
  const product = productManager.getProductById(productId);
  console.log(product); // { id: 1, ...}
} catch (error) {
  console.error(error.message); // "El producto no existe"
}`

¡Listo! Con estos pasos puedes verificar el correcto funcionamiento de la clase `ProductManager`. Si tienes alguna duda o pregunta, no dudes en contactarme (tinchoreta@gmail.com). ¡Gracias! 

