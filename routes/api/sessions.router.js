import { Router } from "express";
import SessionsController from '../../src/controllers/SessionsController.js';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

// Get session information
sessionsRouter.get('/info', (req, res, next) => sessionsController.getSessionInfo(req, res, next));

export default sessionsRouter;
