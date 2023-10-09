import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import CustomError from "../../services/errors/CustomError.js";
import EnumeratedErrors from "../../services/errors/EnumeratedErrors.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";

const verifyResetToken = (req, res, next) => {
    const token = req.body.token; 

    try {
        // Verifica el token y obtén los datos decodificados
        const decoded = jwt.verify(token, config.privateKeyJwt);

        // Verifica si el token ha expirado
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp <= currentTimestamp) {
            throw new CustomError({
                name: EnumeratedErrors.TOKEN_EXPIRED.name,
                message: EnumeratedErrors.TOKEN_EXPIRED.message,
                code: EnumeratedErrors.TOKEN_EXPIRED.code,
            });
        }

        req.decodedToken = decoded;

        next();

    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORIZED).json({ message: error.message, code: error.code });
        } else {
            return res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORIZED).json({ message: 'Token inválido.' });
        }
    }
};

export default verifyResetToken;

