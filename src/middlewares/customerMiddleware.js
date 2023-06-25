import DataBaseCustomerAdapter from "../Business/adapters/DataBaseCustomerAdapter.js";

// Función que devuelve el adaptador de la base de datos
async function getDatabaseCustomerAdapter() {
    const mongoDBURI = process.env.MONGO_DB_URI;
    return DataBaseCustomerAdapter.getInstance(mongoDBURI);
}

async function validateCustomerExistence(req, res, next) {
    const dataBaseCustomerAdapter = await getDatabaseCustomerAdapter();
    const customerId = req.params.id;

    if (!customerId) {
        return res.status(400).json({ success: false, error: "Invalid customer ID" });
    }

    if (!dataBaseCustomerAdapter.isValidCustomerId(customerId)) {
        return res.status(400).json({ success: false, error: "Invalid customer ID" });
    }

    const customer = await dataBaseCustomerAdapter.getCustomerById(customerId);
    if (!customer) {
        return res.status(404).json({ success: false, error: "Customer not found" });
    }

    next();
}

async function validateCustomerFields(req, res, next) {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields",
        });
    }

    // TODO: Perform additional field validations if needed

    next();
}

async function checkDuplicateCustomerEmail(req, res, next) {
    const dataBaseCustomerAdapter = await getDatabaseCustomerAdapter();
    const { email } = req.body;

    const existingCustomer = await dataBaseCustomerAdapter.getCustomerByEmail(email);
    if (existingCustomer) {
        return res.status(400).json({
            success: false,
            error: "Customer with the same email already exists",
        });
    }

    next();
}

export {
    validateCustomerExistence,
    validateCustomerFields,
    checkDuplicateCustomerEmail,
};
