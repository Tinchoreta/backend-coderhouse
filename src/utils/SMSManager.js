import twilio from 'twilio';
import { config } from '../config/config.js';

const cliente = twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);

const sendSms = async (nombre, apellido) => {
    try {
        const mensaje = `Hola ${nombre} ${apellido}, este es un mensaje de prueba desde Twilio.`;

        const message = await cliente.messages.create({
            body: mensaje,
            from: config.TWILIO_PHONE_NUMBER, 
            to: config.MY_PHONE_SMS,  
        });

        console.log('Mensaje de texto enviado:', message.sid);
    } catch (error) {
        console.error('Error al enviar el mensaje de texto:', error);
    }
};

const sendWhatsAppMessage = async (nombre, apellido) => {
    try {
        const mensaje = `Hola ${nombre} ${apellido}, este es un mensaje de prueba desde Twilio.`;

        const message = await cliente.messages.create({
            body: mensaje,
            from: `whatsapp:${config.TWILIO_WHATSAPP}`, 
            to: `whatsapp:${config.MY_PHONE_WHATSAPP}`, 
        });

        console.log('Mensaje de WhatsApp enviado:', message.sid);
    } catch (error) {
        console.error('Error al enviar el mensaje de WhatsApp:', error);
    }
};

export { sendSms, sendWhatsAppMessage };
