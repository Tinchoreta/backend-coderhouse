# Backend - Coderhouse

Este es un proyecto de ejemplo para manejar el backend de Javascript. 
Se utiliza JavaScript (ECMAScript) para el backend.
## Desafio entregable Número uno (Sprint-1)

Se verán aspectos de ECMAScript y ECMAScript avanzado.


## Instalación

1. Clonar el repositorio: `git clone https://github.com/Tinchoreta/backend-coderhouse.git`
2. Instalar las dependencias: `npm install`
3. Ejecutar el servidor: `node index.js`

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


## Clase TextFileProductAdapter

Clase implementada con el patrón de diseño Adapter

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

La clase **TextFileProductAdapter** se encarga de administrar una lista de productos y de guardarla y cargarla desde un archivo `data.json` ubicado en la ruta `./data/data.json`.

## Uso

Para utilizar esta clase, primero se debe crear una instancia de `TextFileProductAdapter`:


`const TextFileProductAdapter = require('./text_file_product_adapter');`

`const textFileProductAdapter = new TextFileProductAdapter();`

Una vez que se tiene una instancia de la clase, se pueden utilizar los siguientes métodos:

`addProduct(product)`
Agrega un nuevo producto a la lista de productos.

Una vez que se tiene una instancia de la clase, se pueden utilizar los siguientes métodos:

`addProduct(product)`
>Agrega un nuevo producto a la lista de productos.

`const product = {`

   `"id": 1,`

  `"name": "Producto 1",`

  `"price": 10.0,`

  `"description": "Descripción del producto 1"`
  
`};`


textFileProductAdapter.addProduct(product);

getProductById(id)
Obtiene un producto por su ID.

const product = textFileProductAdapter.getProductById(1);
console.log(product);
// Output: {"id": 1, "name": "Producto 1", "price": 10.0, "description": "Descripción del producto 1"}


updateProduct(id, product)
Actualiza un producto existente.

const product = {
  "id": 1,
  "name": "Nuevo nombre del Producto 1",
  "price": 20.0,
  "description": "Descripción actualizada del producto 1"
};

textFileProductAdapter.updateProduct(1, product);

deleteProduct(id)
Elimina un producto por su ID.

textFileProductAdapter.deleteProduct(1);

Elimina un producto existente.

textFileProductAdapter.deleteProduct(1);

getProducts()
Obtiene todos los productos existentes.

const products = textFileProductAdapter.getProducts();
console.log(products);
// Output: [{"id": 2, "name": "Producto 2", "price": 20.0, "description": "Descripción del producto 2"}, {"id": 3, "name": "Producto 3", "price": 30.0, "description": "Descripción del producto 3"}, ...]

En este caso, la lista de productos es almacenada y cargada desde un archivo data.json ubicado en la ruta ./data/data.json. Es posible personalizar la ubicación del archivo y el nombre del mismo al crear una instancia de la clase TextFileProductAdapter. Por ejemplo, se podría crear una instancia de la siguiente manera:

const textFileProductAdapter = new TextFileProductAdapter('./mi/ruta/personalizada/data.json');


De esta manera, la lista de productos sería almacenada y cargada desde el archivo ./mi/ruta/personalizada/data.json. Además, se podrían utilizar los mismos métodos para agregar, obtener, actualizar y eliminar productos como se ha mostrado anteriormente.

Pruebas
Para probar el funcionamiento de la clase TextFileProductAdapter se pueden seguir los siguientes pasos:

-1 Crear una instancia de TextFileProductAdapter: 

const TextFileProductAdapter = require('./text_file_product_adapter');

const textFileProductAdapter = new TextFileProductAdapter();


-2 Agregar 10 productos al archivo:

for (let i = 1; i <= 10; i++) {
  const product = {
    "id": i,
    "name": `Producto ${i}`,
    "price": 10.0 * i,
    "description": `Descripción del producto ${i}`
    "thumbnail": `https://ejemplo.com/imagen-producto-${i}.jpg`
    "stock":  Math.floor(Math.random() * (500 - 50 + 1)) + 50
  };

  textFileProductAdapter.addProduct(product);
}

Como se puede ver, se ha agregado la propiedad thumbnail con la URL de la imagen del producto, y la propiedad stock con un número aleatorio entre 50 y 500 utilizando la función Math.random() y un rango de valores de 50 a 500. De esta forma, cada producto tendrá un stock diferente y más realista.

-3 Ver el producto con ID 9:

const product = textFileProductAdapter.getProductById(9);
console.log(product);
// Output: {"id": 9, "name": "Producto 9", "price": 90.0, "description": "Descripción del producto 9"}

-4 Modificar el nombre del producto con ID 9:

const product = {
  "id": 9,
  "name": "Nuevo nombre del Producto 9",
  "price": 90.0,
  "description": "Descripción actualizada del producto 9"
};

textFileProductAdapter.updateProduct(9, product);

-5 Eliminar el producto con ID 10:

textFileProductAdapter.deleteProduct(10);

-6 Ver todos los productos:

const products = textFileProductAdapter.getProducts();
console.log(products);
// Output: [{"id": 1, "name": "Producto 1", "price": 10.0, "description": "Descripción del producto 1"}, {"id": 2, "name": "Producto 2", "price": 20.0, "description": "Descripción del producto 2"}, {"id": 3, "name": "Producto 3", "price": 30.0, "description": "Descripción del producto 3"}, {"id": 4, "name": "Producto 4", "price": 40.0, "description": "Descripción del producto 4"}, {"id": 5, "name": "Producto 5", "price": 50.0, "description": "Descripción del producto 5"}, {"id": 6, "name": "Producto 6", "price": 60.0, "description": "Descripción del producto 6"}, {"id": 7, "name": "Producto 7", "price": 70.0, "description": "Descripción del producto 7"}, {"id": 8, "name": "Producto 8", "price": 80.0, "description": "Descripción del producto 8"}, {"id": 9, "name": "Nuevo nombre del Producto 9", "price": 90.0, "description": "Descripción actualizada del producto 9"}]

Con estos pasos se puede probar el funcionamiento de la clase TextFileProductAdapter y los métodos para agregar, obtener, actualizar y eliminar productos.

## Autor

Este código fue escrito por **Martín Reta** (tinchoreta@gmail.com) y está bajo licencia MIT. Siéntete libre de utilizarlo y mejorarlo como desees.