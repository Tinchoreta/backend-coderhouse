import DataBaseUserAdapter from "../Business/adapters/DataBaseUserAdapter.js";
import { hashSync, genSaltSync, compareSync } from "bcrypt";

// Función que devuelve el adaptador de la base de datos
async function getDatabaseUserAdapter() {
    const mongoDBURI = process.env.MONGO_DB_URI;
    return DataBaseUserAdapter.getInstance(mongoDBURI);
}

async function validateUserExistence(req, res, next) {
    const dataBaseUserAdapter = await getDatabaseUserAdapter();
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ success: false, error: "Invalid user ID" });
    }
    const isValidUserId = await dataBaseUserAdapter.isValidUserId(userId);

    if (!isValidUserId) {
        return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const user = await dataBaseUserAdapter.getUserById(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    next();
}

async function validateUserFields(req, res, next) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields",
        });
    }

    // TODO: Perform additional field validations if needed

    next();
}

async function checkDuplicateUserEmail(req, res, next) {
    const dataBaseUserAdapter = await getDatabaseUserAdapter();
    const { email } = req.body;

    const existingUser = await dataBaseUserAdapter.getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: "User with the same email already exists",
        });
    }

    next();
}

async function validatePasswordLength(req, res, next) {
    const { password } = req.body;

    if (password && password.length < 8) {
        return res.status(400).json({
            success: false,
            error: "Password must be at least 8 characters",
        });
    }

    next();
}

function createHashForPassword(req, res, next) {
    const { password } = req.body;
    const hashPass = hashSync(
        password,
        genSaltSync()
        );
    req.body.password = hashPass;
    return next();
}

async function isPasswordValid(req, res, next) {
    const dataBaseAdapter = await getDatabaseUserAdapter();

    const user = await dataBaseAdapter.getUserByEmail(req.body.mail);

    if (user) {
        let verified = compareSync(
            req.body.pass,
            user.password,
        )
        if (verified) {
            return next();
        }
    } 
    return res.status(401).json({
            success: false,
            error: "Auth error",
        });
}


export {
    validateUserExistence,
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword, 
    isPasswordValid
};
