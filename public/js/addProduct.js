// Función para limpiar los campos del formulario
function limpiar() {
    document.getElementById("productID").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("thumbnail").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("category").value = "";
}

// Función para agregar un nuevo producto
async function addProductToInventory(event) {
    event.preventDefault();
    try {
        // Obtenemos los valores del formulario
        
        let title = document.getElementById("title").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;
        let thumbnail = document.getElementById("thumbnail").value;
        let stock = document.getElementById("stock").value;
        let category = document.getElementById("category").value;

        // Creamos un objeto con los datos del nuevo producto
        let nuevoProducto = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            stock: stock,
            category: category,
        };

        //console.log(nuevoProducto);

        // Realizamos una llamada POST a nuestro endpoint para agregar el nuevo producto
        const response = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            body: JSON.stringify(nuevoProducto),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        const status = await response.status;

        //si fue creado el producto y agregado a la persistencia
        if (status === 201) {
            document.getElementById("productID").textContent = data._id;
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Product added successfully",
                customClass: {
                    container: "my-swal-container",
                    icon: "my-swal-icon",
                    title: "my-swal-title",
                    content: "my-swal-content",
                    actions: "my-swal-actions",
                    confirmButton: "my-swal-confirm",
                },
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "There was en error trying to save the product: " + data.error,
            });
        }
    } catch (error) {
        console.error("Error at adding product:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was en error trying to save the product: " + error.message,
        });
    }
}

document
    .getElementById("productForm")
    .addEventListener("submit", addProductToInventory);
