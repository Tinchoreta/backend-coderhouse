import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import ROLES from "../../utils/userRoles.js";
import verifyResetToken from "../../middlewares/business/resetPasswordMiddleware.js";
import User from "../../models/user.model.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";

const resetPasswordRouter = new CustomRouter();

resetPasswordRouter.post('/',
    [ROLES.PUBLIC], verifyResetToken,
    async (req, res) => {
        const userId = req.decodedToken.id;
        const newPassword = req.body.newPassword;

        try {
            // Busca al usuario por su ID
            const user = await User.findById(userId);

            if (!user) {
                return res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).json({ message: 'Usuario no encontrado.' });
            }

            // Actualiza la contraseña del usuario
            user.password = newPassword;

            // Limpia los campos de token de restablecimiento de contraseña
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            // Guarda los cambios en la base de datos
            await user.save();

            return res.status(HTTP_STATUS_CODES.HTTP_OK).json({ message: 'Contraseña cambiada con éxito.' });
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({ message: 'Error interno del servidor.' });
        }
    });

export default resetPasswordRouter;
