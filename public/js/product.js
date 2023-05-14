// // Función para limpiar los campos del formulario
// function limpiar() {
//     document.getElementById("id").value = "";
//     document.getElementById("title").value = "";
//     document.getElementById("description").value = "";
//     document.getElementById("price").value = "";
//     document.getElementById("thumbnail").value = "";
//     document.getElementById("stock").value = "";
// }

// // Función para agregar un nuevo producto
// async function agregarProducto() {
//     try {
//         // Obtenemos los valores del formulario
//         let id = document.getElementById("id").value;
//         let title = document.getElementById("title").value;
//         let description = document.getElementById("description").value;
//         let price = document.getElementById("price").value;
//         let thumbnail = document.getElementById("thumbnail").value;
//         let stock = document.getElementById("stock").value;

//         // Creamos un objeto con los datos del nuevo producto
//         let nuevoProducto = {
//             id: id,
//             title: title,
//             description: description,
//             price: price,
//             thumbnail: thumbnail,
//             stock: stock
//         };

//         console.log(nuevoProducto);

//         // Realizamos una llamada POST a nuestro endpoint para agregar el nuevo producto
//         const response = await fetch('/api/products/', {
//             method: 'POST',
//             body: JSON.stringify(nuevoProducto),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         const data = await response.json();

//         console.log('Nuevo producto agregado:', data);
//         alert('Producto agregado correctamente');
//         limpiar();
//     } catch (error) {
//         console.error('Error al agregar el producto:', error);
//         alert('Hubo un error al agregar el producto: '+ error.message);
//     }
// }
// document.getElementById("productForm").addEventListener("submit", agregarProducto);
