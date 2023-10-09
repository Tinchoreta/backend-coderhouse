import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import User from "../../models/user.model.js";
import ROLES from "../../utils/userRoles.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";
import { validatePasswordLength, createHashForPassword } from "../../middlewares/business/userMiddleware.js";
import verifyResetToken from "../../middlewares/business/resetPasswordMiddleware.js";

const resetPasswordRouter = new CustomRouter();

resetPasswordRouter.post('/',
    [ROLES.PUBLIC],
    validatePasswordLength, // Valida la longitud de la contraseña
    createHashForPassword, // Encripta la contraseña
    verifyResetToken, //Verifica que no haya caducado el token (1hr).

    async (req, res) => {
        
        const userEmail = req.body.email;
        const newPassword = req.body.password;

        try {
            // Busca al usuario por su dirección de correo electrónico
            const user = await User.findOne({ email: userEmail });

            if (!user) {
                return res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).json({ message: 'Usuario no encontrado.' });
            }

            // En este punto, la contraseña ya está encriptada debido al middleware createHashForPassword

            user.password = newPassword; // Actualiza la contraseña

            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await user.save({ validateModifiedOnly: true });

            return res.status(HTTP_STATUS_CODES.HTTP_OK).json({ message: 'Contraseña cambiada con éxito.' });
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({ message: 'Error interno del servidor.' });
        }
    });

export default resetPasswordRouter;
