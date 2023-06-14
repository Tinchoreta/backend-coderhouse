import { Router } from "express";
// import dotenv from 'dotenv';

import DataBaseCartManagerAdapter from "../../src/Business/adapters/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../src/Business/adapters/DataBaseProductAdapter.js";
import CartManagerController from "../../src/controllers/CartManagerController.js";


const router = Router();
// dotenv.config();


const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const dataBaseCartAdapter =
    DataBaseCartManagerAdapter.getInstance(process.env.MONGO_DB_URI);

const cartController = new CartManagerController(
    dataBaseCartAdapter,
    dataBaseProductAdapter
);

router.get("/", (req, res) => cartController.getCarts(req, res));
router.get("/:id", (req, res) => cartController.getCartById(req, res));
router.post("/", (req, res) => cartController.createCart(req, res));
router.put("/:cid/product/:pid/:units", (req, res) =>
    cartController.addProductUnitsToCart(req, res)
);
router.delete("/:cid/product/:pid/:units", (req, res) =>
    cartController.removeProductUnitsFromCart(req, res)
);

export default router;
