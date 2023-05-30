import dotenv from 'dotenv';

// Middleware para cargar las variables de entorno desde el archivo .env
const dotenvMiddlewares = (req, res, next) => {
    dotenv.config(); // Carga las variables de entorno desde el archivo .env
    next();
};

export default dotenvMiddlewares;
