# Backend - Coderhouse

Este es un proyecto de ejemplo para manejar el backend de Javascript. 
Se utiliza JavaScript (ECMAScript) para el backend.
## Desafio entregable Número uno (Sprint-1)

Se verán aspectos de ECMAScript y ECMAScript avanzado. Y patrones de diseño aprendidos en el libro: [Dive into design Patterns - Alexander Shvets](https://refactoring.guru/design-patterns/book)


## Instalación

1. Clonar el repositorio: `git clone https://github.com/Tinchoreta/backend-coderhouse.git`
2. Instalar las dependencias: `npm install`
3. Ejecutar el servidor: `node index.js`

## Funciones ECMAScript

El proyecto utiliza las siguientes funciones ECMAScript:

- `findIndex`: Busca en un array el índice del primer elemento que cumple una condición especificada.
- `find`: Busca en un array el primer elemento que cumple una condición especificada.
- `splice`: Cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
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
-`updateProduct(idProducto, objProductProps)`: Edita las propiedades del producto con el id especificado.
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


```js
const newProduct = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  stock: 25
};

const prodAdmin = new ProductManager();
try{
  prodAdmin.addProduct(newProduct);
  console.log(`Producto agregado con id: ${prodAdmin.id}`);
} catch (error) {
  console.error(error.message);
}
```
## Obtiene los productos actualizados con el método getProducts

```js
const products = prodAdmin.getProducts();

console.log(products); // [{...}]
```

## Evaluar el método getProductById para obtener un producto por su id


```js
const productId = 1; // ID del producto a buscar y mostrar


try{
  const product = prodAdmin.getProductById(productId);
  console.log(product); // { id: 1, ...}
} catch (error) {
  console.error(error.message); 
}
``` 
## Editar un producto

`editProduct(idProduct, objProductProps)`: Este método permite editar las propiedades de un producto existente. Para usar este método, necesitas pasar dos argumentos:

`idProduct (número)`: el ID del producto que deseas modificar.
`objProductProps (objeto)`: un objeto que contiene las nuevas propiedades del producto que deseas actualizar.

Ejemplo de caso de uso:

```js
// Editar un producto existente` 

const idProducto = 1; // ID del producto agregado anteriormente
const newProductProps = {
  price: 25.99,
  description: "Esta es la nueva descripción del producto",
};

try {
  prodAdmin.editProduct(idProducto, newProductProps);
  console.log("Producto editado correctamente");
} catch (error) {
  console.error(error.message);
}
```

## Eliminar un producto

```js
// Eliminar un producto existente
const idProductoAEliminar = 1; // ID del producto agregado anteriormente

try {
  prodAdmin.deleteProduct(idProductoAEliminar);
  console.log("Producto eliminado correctamente");
} catch (error) {
  console.error(error.message);
}
```

## Desafio entregable Número uno (Sprint-2)

## Clase TextFileProductAdapter

Clase implementada con el patrón de diseño **Adapter** y el patrón **Singleton**. Implementados con la lectura del libro: [Dive into design Patterns (Alexander Shvets) - 2019] (https://refactoring.guru/design-patterns/book). Básicamente posee la misma interfaz que **ProductManager**, pero la gran diferencia es que gestiona la persistencia de los Productos en un archivo de texto `data.json`.

La clase **TextFileProductAdapter** es una adaptador que permite manejar productos utilizando una estrategia de almacenamiento en un archivo de texto. Utiliza la clase ***PersistenceManager*** y la estrategia de almacenamiento ***TextFileStrategy*** para cargar, guardar, agregar, actualizar y eliminar productos en el archivo de texto.

Esta clase se encuentra en la carpeta de business e interactúa con las clases:
- **PersistenceManager**
- **TextFileStrategy**

### Clase PersistenceManager

PersistenceManager en JavaScript es una clase que gestiona la persistencia de datos aplicando el patrón "Strategy". Cada estrategia de almacenamiento de datos requiere la implementación de un adaptador correspondiente (en este caso existe la clase **TextFileProductAdapter** que es la estrategia de almacenamiento en archivo de texto plano). Los métodos disponibles son: `constructor()`, `setStrategy()`, `save()`, `load()`, y `delete()`. Cada estrategia de persistencia específica debe implementar un adaptador que defina estos métodos con la lógica necesaria para interactuar con el sistema de almacenamiento de datos correspondiente.

### Clase TextFileStrategy

La clase TextFileStrategy es parte del patrón Strategy y se utiliza para permitir la estrategias de almacenamiento de datos en un archivo de texto plano. 
Tiene 3 métodos: `save()` guarda los datos proporcionados en el archivo, `load()` carga los datos del archivo y `delete()` elimina el archivo.
Para utilizarla, importe la clase, cree una instancia proporcionando la ruta del archivo y use los métodos.

## Propiedades

**instance (estática)**: Almacena la única instancia de la clase *Patrón Singleton*.

## Métodos

**constructor(pathToFile)**: Constructor que inicializa una instancia de la clase **TextFileProductAdapter** con la ruta del archivo de texto que se va a utilizar para almacenar los productos. Si ya existe una instancia de la clase, lanza un error (Singleton).

**getInstance(pathToFile)**: Método estático que devuelve la única instancia de la clase **TextFileProductAdapter**. Si no existe una instancia, crea una nueva.

**getProducts()**: Método asíncrono que carga todos los productos del archivo de texto y los devuelve en una lista. Si no hay productos en el archivo, lanza un error.

**getProductById(idProduct)**: Método asíncrono que carga todos los productos del archivo de texto, busca el producto con el ID especificado y lo devuelve. Si el producto no existe, lanza un error.

**addProduct(productToAdd)**: Método asíncrono que agrega un nuevo producto al archivo de texto. El producto se agrega con un ID autoincremental y los datos especificados en productToAdd. Devuelve el ID del nuevo producto.

**updateProduct(productId, productData)**: Método asíncrono que actualiza los datos de un producto en el archivo de texto. Busca el producto con el ID especificado y actualiza los datos con los valores de productData. Si alguna propiedad en productData es null o undefined, se conserva el valor original del producto. Devuelve el producto actualizado.

**deleteProduct(id)**: Método asíncrono que elimina un producto del archivo de texto. Busca el producto con el ID especificado y lo elimina. Si el producto no existe, lanza un error.

En resumen: La clase **TextFileProductAdapter** se encarga de administrar una lista de productos y de guardarla y cargarla desde un archivo `data.json` ubicado en la ruta `./data/data.json`.

## Uso

Para utilizar esta clase, primero se debe crear una instancia de:

```js
TextFileProductAdapter:


const TextFileProductAdapter = require('./text_file_product_adapter_path/TextFileProductAdapter');

const textFileAdapter = TextFileProductAdapter.getInstance("./data/data.json");
```

Una vez que se tiene una instancia de la clase, se pueden utilizar los siguientes métodos:

`addProduct(productToAdd)`

Agrega un nuevo producto a la lista de productos.

```js
const product = {
   "id": 1,
  "name": "Producto 1",
  "price": 10.0,
  "description": "Descripción del producto 1"
};

textFileProductAdapter.addProduct(product);

getProductById(id)

//Obtiene un producto por su ID.


const product = textFileProductAdapter.getProductById(1);

console.log(product);

// Output: {"id": 1, "name": "Producto 1", "price": 10.0,
"description": "Descripción del producto 1"}
```

### updateProduct(id, product)

Actualiza un producto existente.

```js
const product = {
  "id": 1,
  "name": "Nuevo nombre del Producto 1",
  "price": 20.0,
  "description": "Descripción actualizada del producto 1"
};

textFileProductAdapter.updateProduct(1, product);
```

### deleteProduct(id)
Elimina un producto por su ID.

```js
textFileProductAdapter.deleteProduct(1);
```

### getProducts()
Obtiene todos los productos existentes.

```js
const products = textFileProductAdapter.getProducts();
console.log(products);

// Output: [{"id": 2, "name": "Producto 2", "price": 20.0, "description": "Descripción del producto 2"}, {"id": 3, "name": "Producto 3", "price": 30.0, "description": "Descripción del producto 3"}, ...]
```
En este caso, la lista de productos es almacenada y cargada desde un archivo data.json ubicado en la ruta ./data/data.json. Es posible personalizar la ubicación del archivo y el nombre del mismo al crear una instancia de la clase TextFileProductAdapter. Por ejemplo, se podría crear una instancia de la siguiente manera:

```js
const textFileProductAdapter = new TextFileProductAdapter('./mi/ruta/personalizada/data.json');
```


De esta manera, la lista de productos sería almacenada y cargada desde el archivo `./mi/ruta/personalizada/data.json`. Además, se podrían utilizar los mismos métodos para agregar, obtener, actualizar y eliminar productos como se ha mostrado anteriormente.

## Pruebas de integración 

Para probar el funcionamiento de la clase **TextFileProductAdapter** se pueden seguir los siguientes pasos:

- 1 Crear una instancia de **TextFileProductAdapter**: 

```js
const TextFileProductAdapter = require('./text_file_product_adapter');

const textFileProductAdapter = new TextFileProductAdapter();
```

- 2 Agregar 10 productos al archivo:

```js

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
        }
```

Como se puede ver, se ha agregado la propiedad thumbnail con la URL de la imagen del producto, y la propiedad stock con un número aleatorio entre 50 y 500 utilizando la función Math.random() y un rango de valores de 50 a 500 y la propiedad precio con un número aleatorio entre 100 y 1000 utilizando la función Math.random() y un rango de valores de 50 a 500. 
De esta forma, cada producto tendrá un stock y precio diferente y más "realista".

- 3 Ver el producto con ID 9:

```js
const product = textFileProductAdapter.getProductById(9);
console.log(product);
// Output: {"id": 9, "title": "Producto 9","description": "Descripción del producto 9", "price": 90.0,"stock": 100}
```

- 4 Modificar el nombre del producto con ID 9:

```js
const product = {
  "id": 9,
  "name": "Nuevo nombre del Producto 9",
  "price": 90.0,
  "description": "Descripción actualizada del producto 9"
};

textFileProductAdapter.updateProduct(9, product);
```

- 5 Eliminar el producto con ID 10:

```js
try {
    prodAdmin.deleteProduct(idProductoAEliminar);
    console.log("Resultado de: deleteProduct(idProductoAEliminar);")
    console.log(prodAdmin.getProducts())
} catch (error) {
    console.error(error.message);
}

textFileProductAdapter.deleteProduct(10);
```

- 6 Ver todos los productos:

```js
const products = textFileProductAdapter.getProducts();
console.log(products);
// Output: [  {"id": 1, "name": "Producto 1", "price": 10.0, "description": "Descripción del producto 1", "stock": 287},  {"id": 2, "name": "Producto 2", "price": 20.0, "description": "Descripción del producto 2", "stock": 198},  {"id": 3, "name": "Producto 3", "price": 30.0, "description": "Descripción del producto 3", "stock": 406},  {"id": 4, "name": "Producto 4", "price": 40.0, "description": "Descripción del producto 4", "stock": 51},  {"id": 5, "name": "Producto 5", "price": 50.0, "description": "Descripción del producto 5", "stock": 431},  {"id": 6, "name": "Producto 6", "price": 60.0, "description": "Descripción del producto 6", "stock": 237},  {"id": 7, "name": "Producto 7", "price": 70.0, "description": "Descripción del producto 7", "stock": 264},  {"id": 8, "name": "Producto 8", "price": 80.0, "description": "Descripción del producto 8", "stock": 358},  {"id": 9, "name": "Nuevo nombre del Producto 9", "price": 90.0, "description": "Descripción actualizada del producto 9", "stock": 78}]

```
Para las pruebas, se sugiere vaciar el archivo `./data/data.json` ya que sino algunas pruebas como borrar el producto con ID 10 no tendrán el efecto deseado al no encontrar el producto que ya fue borrado del archivo.
Con estos pasos se puede probar el funcionamiento de la clase TextFileProductAdapter y los métodos para agregar, obtener, actualizar y eliminar productos (CRUD)


## Desafio entregable Número uno (Sprint-3)

En este sprint se ha creado la clase `ProductManagerController`, la cual tiene como función actuar como controlador en la gestión de productos. Se encarga de recibir y responder solicitudes HTTP para agregar, obtener, actualizar y eliminar productos, y utiliza un adaptador productManagerAdapter para interactuar con la base de datos, que en este caso se trata de un archivo JSON, administrado por PersistenceManager y TextFileStrategy.

Además, en el código de esta clase se proporciona una lista de *códigos de estado HTTP* con sus correspondientes descripciones, con el fin de tener un mejor entendimiento de los errores que pueden surgir al realizar solicitudes.

A continuación, se detalla el uso de los métodos de esta clase:

`addProduct`: recibe una solicitud HTTP con los datos del producto a agregar en el cuerpo de la solicitud, verifica que la solicitud contenga los datos necesarios y utiliza el adaptador para agregar el producto a la base de datos. Responde con un código de estado HTTP 201 y el producto agregado en caso de éxito, o un código de estado HTTP 400 o 500 en caso de error.

`getProducts`: recibe una solicitud HTTP para obtener todos los productos, verifica si se ha especificado un límite en la cantidad de productos a devolver y utiliza el adaptador para obtener los productos de la base de datos. Responde con un código de estado HTTP 200 y los productos obtenidos en caso de éxito, o un código de estado HTTP 500 en caso de error.

`getProductById`: recibe una solicitud HTTP para obtener un producto específico según su ID, utiliza el adaptador para buscar el producto en la base de datos y responde con un código de estado HTTP 200 y el producto encontrado en caso de éxito, o un código de estado HTTP 404 o 500 en caso de error.

`updateProductItem`: recibe una solicitud HTTP para actualizar un producto específico según su ID, utiliza el adaptador para actualizar el producto en la base de datos y responde con un código de estado HTTP 200 y el producto actualizado en caso de éxito, o un código de estado HTTP 500 en caso de error.

`removeProductItem`: recibe una solicitud HTTP para eliminar un producto específico según su ID, utiliza el adaptador para eliminar el producto de la base de datos y responde con un código de estado HTTP 204 en caso de éxito, o un código de estado HTTP 500 en caso de error.

## Autor

Este código fue escrito por **Martín Reta** tinchoreta@gmail.com y está bajo licencia MIT. Siéntete libre de utilizarlo y mejorarlo como desees.