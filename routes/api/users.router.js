import { Router } from "express";
import UserManagerController from "../../src/controllers/UserManagerController.js";
import DataBaseUserAdapter from "../../src/Business/adapters/DataBaseUserAdapter.js";
import {
    validateUserExistence,
    validateUserFields,
    checkDuplicateUserEmail,
} from "../../src/middlewares/userMiddleware.js";

const router = Router();

const dataBaseUserAdapter = DataBaseUserAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const userController = new UserManagerController(dataBaseUserAdapter);

router.get("/", (req, res) => userController.getUsers(req, res));

router.get("/:id", validateUserExistence, (req, res) => userController.getUserById(req, res));

router.post("/", validateUserFields, checkDuplicateUserEmail, (req, res) => userController.addUser(req, res));

router.put("/:id", validateUserExistence, (req, res) => userController.updateUser(req, res));

router.delete("/:id", validateUserExistence, (req, res) => userController.removeUser(req, res));

export default router;
