document.addEventListener("DOMContentLoaded", function () {
    
    const newPasswordInput = document.getElementById("inputNewPassword");
    const confirmPasswordInput = document.getElementById("inputConfirmPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");

    
    changePasswordButton.addEventListener("click", function () {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        
        alert("Contraseña cambiada exitosamente.");

        // Limpiar los campos de contraseña
        newPasswordInput.value = "";
        confirmPasswordInput.value = "";
    });
});
