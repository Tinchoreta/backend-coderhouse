import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import path from 'path';
import __dirname from '../utils.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_USER_APP,
        pass: config.GMAIL_PASS_APP
    }
});

export const sendMail = async () => {
    try {
        // Definir el contenido del correo electrónico
        const mailOptions = {
            from: config.GMAIL_USER_APP,
            to: 'tinchoreta@gmail.com',
            subject: 'Asunto del correo electrónico',
            text: 'Contenido del correo electrónico en formato de texto plano.',
            html: '<p>Contenido del correo electrónico en formato HTML.</p>',
            attachments: [
                {
                    filename: '1.jpg', // Cambia el nombre de la imagen si lo deseas
                    path: path.join(__dirname, '/themes/images/products/1.jpg') // Reemplaza con la ruta correcta a tu imagen adjunta
                }
            ]
        };

        // Enviar el correo electrónico
        const info = await transport.sendMail(mailOptions);

        console.log('Correo electrónico enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
};
