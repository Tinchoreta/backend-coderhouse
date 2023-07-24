import { Router } from "express";
import CustomerManagerController from "../../controllers/CustomerManagerController.js";
import DataBaseCustomerAdapter from "../../Business/adapters/DataBaseCustomerAdapter.js";
import {
    validateCustomerExistence,
    validateCustomerFields,
    checkDuplicateCustomerEmail,
} from "../../middlewares/customerMiddleware.js";

const router = Router();

const dataBaseCustomerAdapter = DataBaseCustomerAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const customerController = new CustomerManagerController(dataBaseCustomerAdapter);

router.get("/", (req, res) => customerController.getCustomers(req, res));

router.get("/:id", validateCustomerExistence, (req, res) => customerController.getCustomerById(req, res));

router.post("/", validateCustomerFields, checkDuplicateCustomerEmail, (req, res) => customerController.addCustomer(req, res));

router.put("/:id", validateCustomerExistence, (req, res) => customerController.updateCustomer(req, res));

router.delete("/:id", validateCustomerExistence, (req, res) => customerController.removeCustomer(req, res));

export default router;
