import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import __dirname from '../utils.js';
import { generateResetToken } from '../utils/passwordReset.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_USER_APP,
        pass: config.GMAIL_PASS_APP
    }
});

// Función para enviar correo de restablecimiento de contraseña
export const sendPasswordResetEmail = async (toEmail) => {
    const subject = 'Restablecimiento de contraseña';
    const text = 'Has solicitado restablecer tu contraseña en nuestro sitio web. Si no solicitaste esto, ignora este correo.';

    // Genera el token JWT
    const resetToken = generateResetToken(toEmail);

    // Construye el enlace de restablecimiento con el token JWT
    const resetLink = `http://localhost:8080/reset-password?token=${resetToken}`;

    const html = `
        <p>Has solicitado restablecer tu contraseña en nuestro sitio web.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si no solicitaste esto, ignora este correo.</p>
    `;

    // Definir las opciones del correo electrónico
    const mailOptions = {
        from: config.GMAIL_USER_APP,
        to: toEmail,
        subject: subject,
        text: text,
        html: html,
    };

    // Envía el correo electrónico
    try {
        await sendMail(mailOptions);
        console.log('Correo de restablecimiento de contraseña enviado correctamente.');
    } catch (error) {
        console.error('Hubo un error al enviar el correo de restablecimiento de contraseña:', error);
    }
};

// Función para enviar correos electrónicos personalizados
export const sendMail = async (mailOptions) => {
    try {
        // Enviar el correo electrónico
        const info = await transport.sendMail(mailOptions);

        console.log('Correo electrónico enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
};
