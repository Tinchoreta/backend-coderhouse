document.addEventListener("DOMContentLoaded", function () {
    const newPasswordInput = document.getElementById("inputNewPassword");
    const confirmPasswordInput = document.getElementById("inputConfirmPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const feedbackMessage = document.getElementById("feedbackMessage"); // Elemento para mostrar mensajes al usuario

    changePasswordButton.addEventListener("click", async function () {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            feedbackMessage.textContent = "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.";
            return;
        }

        // Validar la complejidad de la contraseña (agrega tus propias reglas de validación)
        if (newPassword.length < 8) {
            feedbackMessage.textContent = "La contraseña debe tener al menos 8 caracteres.";
            return;
        }

        // Obtener el correo electrónico de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");
        const token = urlParams.get("token");

        // Enviar la solicitud al servidor para cambiar la contraseña
        try {
            const response = await fetch("http://localhost:8080/api/reset-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token , email: email, password: newPassword }),
            });

            if (response.ok) {
                feedbackMessage.textContent = "Contraseña cambiada exitosamente.";
                newPasswordInput.value = "";
                confirmPasswordInput.value = "";
            } else {
                const data = await response.json();
                feedbackMessage.textContent = data.message || "Hubo un error al cambiar la contraseña.";
            }
        } catch (error) {
            feedbackMessage.textContent = "Hubo un error al conectar con el servidor.";
        }
    });
});
