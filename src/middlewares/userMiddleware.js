import DataBaseUserAdapter from "../Business/adapters/DataBaseUserAdapter.js";

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

    if (!dataBaseUserAdapter.isValidUserId(userId)) {
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

export {
    validateUserExistence,
    validateUserFields,
    checkDuplicateUserEmail,
    validatePasswordLength
};
