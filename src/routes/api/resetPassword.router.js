import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import User from "../../models/user.model.js";
import ROLES from "../../utils/userRoles.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";
import { validatePasswordLength, createHashForPassword } from "../../middlewares/business/userMiddleware.js";

const resetPasswordRouter = new CustomRouter();

resetPasswordRouter.post('/',
    validatePasswordLength, // Middleware para validar la longitud de la contraseña
    createHashForPassword, // Middleware para encriptar la contraseña
    [ROLES.PUBLIC],
    async (req, res) => {
        const userId = req.decodedToken.id;
        const newPassword = req.body.newPassword;

        try {
            // Busca al usuario por su ID
            const user = await User.findById(userId);

            if (!user) {
                return res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).json({ message: 'Usuario no encontrado.' });
            }

            // En este punto, ala contraseña ya está encriptada debido al middleware createHashForPassword

            user.password = newPassword; // Actualiza la contraseña

            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await user.save();

            return res.status(HTTP_STATUS_CODES.HTTP_OK).json({ message: 'Contraseña cambiada con éxito.' });
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({ message: 'Error interno del servidor.' });
        }
    });

export default resetPasswordRouter;
