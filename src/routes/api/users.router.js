import UserManagerController from "../../controllers/UserManagerController.js";
import DataBaseUserAdapter from "../../Business/adapters/DataBaseUserAdapter.js";
import {
    validateUserExistence,
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword
} from "../../middlewares/business/userMiddleware.js";
import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import ROLES from "../../utils/userRoles.js";

import uploader from "../../middlewares/utils/multer.js";

const router = new CustomRouter();

const dataBaseUserAdapter = DataBaseUserAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const userController = new UserManagerController(dataBaseUserAdapter);

router.get("/",[ROLES.ADMIN],  (req, res) => userController.getUsers(req, res));

router.get("/:id", [ROLES.ADMIN], validateUserExistence, (req, res) => userController.getUserById(req, res));

router.post("/", [ROLES.ADMIN],
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword, (req, res) => userController.addUser(req, res));

router.put("/:id", [ROLES.ADMIN], validateUserExistence, (req, res) => userController.updateUser(req, res));

router.delete("/:id", [ROLES.ADMIN], validateUserExistence, (req, res) => userController.removeUser(req, res));

router.post("/:uid/profile-image", [ROLES.USER], uploader.single("profileImage"), (req, res) => {
    userController.uploadProfileImage(req, res);
});

export default router;
