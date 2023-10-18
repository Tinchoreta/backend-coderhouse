import SessionsController from '../../controllers/SessionController.js';
import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import ROLES from '../../utils/userRoles.js';

const sessionsRouter = new CustomRouter();
const sessionsController = new SessionsController();

// Get session information
sessionsRouter.get('/info', [ROLES.ADMIN], (req, res, next) => sessionsController.getSessionInfo(req, res, next));

export default sessionsRouter;
