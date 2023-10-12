import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import { sendSms, sendWhatsAppMessage } from "../../utils/SMSManager.js";
import ROLES from "../../utils/userRoles.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";

const smsRouter = new CustomRouter();

smsRouter.get('/sms',
    [ROLES.PUBLIC],
    async (req, res) => {
        try {
            // Personaliza el mensaje de texto con los datos del destinatario
            const nombre = 'Martín'; // Reemplaza con el nombre del destinatario
            const apellido = 'Reta'; // Reemplaza con el apellido del destinatario

            // Llama a la función sendSms para enviar el mensaje de texto
            await sendSms(nombre, apellido);

            // Si el envío del mensaje fue exitoso, devuelve una respuesta con éxito
            res.status(HTTP_STATUS_CODES.HTTP_OK).json({
                success: true,
                message: 'Mensaje de texto enviado correctamente.'
            });
        } catch (error) {
            // Si hubo algún error durante el envío del mensaje, devuelve un mensaje de error
            res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Hubo un error al enviar el mensaje de texto.'
            });
        }
    }
);

smsRouter.get('/whatsapp',
    [ROLES.PUBLIC],
    async (req, res) => {
        try {
            // Personaliza el mensaje de WhatsApp con los datos del destinatario
            const nombre = 'Martín'; // Reemplaza con el nombre del destinatario
            const apellido = 'Reta'; // Reemplaza con el apellido del destinatario

            // Llama a la función sendWhatsAppMessage para enviar el mensaje de WhatsApp
            await sendWhatsAppMessage(nombre, apellido);

            // Si el envío del mensaje fue exitoso, devuelve una respuesta con éxito
            res.status(HTTP_STATUS_CODES.HTTP_OK).json({
                success: true,
                message: 'Mensaje de WhatsApp enviado correctamente.'
            });
        } catch (error) {
            // Si hubo algún error durante el envío del mensaje, devuelve un mensaje de error
            res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Hubo un error al enviar el mensaje de WhatsApp.'
            });
        }
    }
);

export default smsRouter;
