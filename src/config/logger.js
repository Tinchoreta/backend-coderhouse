import winston from "winston";

const customLevelOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'gray',
        http: 'blue',
        info: 'green',
        warning: 'yellow',
        error: 'red',
        fatal: 'magenta'
    },
};


const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info", // Nivel mínimo de log para el logger de desarrollo
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            level: process.env.LOG_LEVEL || "info", // Nivel mínimo de log que se mostrará en la consola
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

export default function (req, res, next) {

    logger.info(`${req.method} ${req.url}`);

    next();
}