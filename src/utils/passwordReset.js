import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Genera un token JWT para restablecimiento de contraseña
export const generateResetToken = (email) => {
    const token = jwt.sign({ email }, config.privateKeyJwt, { expiresIn: '1h' });
    return token;
};