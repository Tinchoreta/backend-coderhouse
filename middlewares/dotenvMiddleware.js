import dotenv from 'dotenv';

// Middleware para cargar las variables de entorno desde el archivo .env
const dotenvMiddlewares = (req, res, next) => {
    try {
        dotenv.config(); // Carga las variables de entorno desde el archivo .env
        next();
    } catch (e) {
        next(e);
    }
};

export default dotenvMiddlewares;
