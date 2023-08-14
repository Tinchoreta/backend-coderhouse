import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import ROLES from "../../utils/roles.js";
import logger from "../../config/logger.js";

const loggerRouter = new CustomRouter();

loggerRouter.get('/',
    [ROLES.PUBLIC],
    async (req, res) => {
        const logger = req.logger;
        logger.debug("Este es un mensaje de debug");
        logger.http("Este es un mensaje de http");
        logger.info("Este es un mensaje de info");
        logger.warning("Este es un mensaje de advertencia");
        logger.error("Este es un mensaje de error");
        logger.fatal("Este es un mensaje de fatal");
        res.send("Prueba de logs realizada");
    }
);

export default loggerRouter;