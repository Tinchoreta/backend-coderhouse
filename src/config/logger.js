import winston from "winston";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'gray'
    },
};

winston.addColors(customLevelOptions.colors);

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
    req.logger = logger;
    logger.info(`${req.method} ${req.url}`);

    next();
}