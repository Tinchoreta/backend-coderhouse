import DataBaseUserAdapter from "../../Business/adapters/DataBaseUserAdapter.js";
import { hashSync, genSaltSync, compareSync } from "bcrypt";

import CustomError from "../../services/errors/CustomError.js";
import EnumeratedErrors from "../../services/errors/EnumeratedErrors.js";

// Función que devuelve el adaptador de la base de datos
async function getDatabaseUserAdapter() {
    const mongoDBURI = process.env.MONGO_DB_URI;
    return DataBaseUserAdapter.getInstance(mongoDBURI);
}

async function validateUserExistence(req, res, next) {
    const dataBaseUserAdapter = await getDatabaseUserAdapter();
    const userId = req.params.id;

    if (!userId) {
        throw new CustomError({
            name: EnumeratedErrors.INVALID_TYPE_ERROR,
            message: "Invalid user ID"
        });
    }

    const isValidUserId = await dataBaseUserAdapter.isValidUserId(userId);

    if (!isValidUserId) {
        throw new CustomError({
            name: EnumeratedErrors.INVALID_TYPE_ERROR,
            message: "Invalid user ID"
        });
    }

    const user = await dataBaseUserAdapter.getUserById(userId);
    if (!user) {
        throw new CustomError({
            name: EnumeratedErrors.USER_NOT_FOUND,
            message: "User not found"
        });
    }

    next();
}

async function validateUserFields(req, res, next) {
    const { firstName, lastName, email, password, role, age } = req.body;

    if (!firstName || !lastName || !role || !email || !password || !age) {
        throw new CustomError({
            name: EnumeratedErrors.VALIDATION_ERROR,
            message: "Missing required fields"
        });
    }

    next();
}

async function checkDuplicateUserEmail(req, res, next) {
    const dataBaseUserAdapter = await getDatabaseUserAdapter();
    const { email } = req.body;

    const existingUser = await dataBaseUserAdapter.getUserByEmail(email);
    if (existingUser) {
        throw new CustomError({
            name: EnumeratedErrors.VALIDATION_ERROR,
            message: "User with the same email already exists"
        });
    }

    next();
}

async function validatePasswordLength(req, res, next) {
    const { password } = req.body;

    if (password && password.length < 8) {
        throw new CustomError({
            name: EnumeratedErrors.VALIDATION_ERROR,
            message: "Password must be at least 8 characters"
        });
    }

    next();
}

function createHashForPassword(req, res, next) {
    const { password } = req.body;
    const hashPass = hashSync(password, genSaltSync());
    req.body.password = hashPass;
    next();
}

async function isPasswordValid(req, res, next) {
    const { password } = req.body;
    const databasePassword = req.user.password;

    const verified = compareSync(password, databasePassword);

    if (verified) {
        next();
    } else {
        throw new CustomError({
            name: EnumeratedErrors.AUTHENTICATION_ERROR,
            message: "Authentication error"
        });
    }
}

function trimUserData(req, res, next) {
    if (req.body.firstName) {
        req.body.firstName = req.body.firstName.trim();
    }
    if (req.body.lastName) {
        req.body.lastName = req.body.lastName.trim();
    }
    if (req.body.email) {
        req.body.email = req.body.email.trim();
    }
    if (req.body.password) {
        req.body.password = req.body.password.trim();
    }
    if (req.body.role) {
        req.body.role = req.body.role.trim();
    }
    next();
}



export {
    validateUserExistence,
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength,
    createHashForPassword,
    isPasswordValid,
    trimUserData,
};
