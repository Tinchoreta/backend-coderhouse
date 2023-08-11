import winston from "winston";

const customLevelOptions = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'blue',
        verbose: 'cyan',
        debug: 'magenta',
        silly: 'gray'
    },
};


const logger = winston.createLogger({
    level: "info",
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            level: "http", // Nivel mínimo de log que se mostrará en la consola
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: "error.log", level: "warn" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

export default function (req, res, next) {

    logger.info(`${req.method} ${req.url}`);

    next();
}