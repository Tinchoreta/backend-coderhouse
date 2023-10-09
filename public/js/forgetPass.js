document.addEventListener("DOMContentLoaded", function () {
    const resetPasswordForm = document.getElementById("resetPasswordForm");

    resetPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("inputEmail1");
        const email = emailInput.value;

        try {
            const response = await fetch("/api/mail/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                alert("Se ha enviado un correo de restablecimiento de contraseña. Revise su bandeja de entrada.");
            } else {
                alert("Hubo un error al enviar el correo de restablecimiento de contraseña.");
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
        }
    });
});