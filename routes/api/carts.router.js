import { Router } from "express";
import CartManagerController from "../../src/controllers/CartManagerController.js";

import DataBaseCartManagerAdapter from "../../src/Business/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../src/Business/DataBaseProductAdapter.js";



const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
    process.env.MONGODB_URI
);

const dataBaseCartAdapter =
    DataBaseCartManagerAdapter.getInstance(process.env.MONGODB_URI);
const cartController = new CartManagerController(
    dataBaseCartAdapter,
    dataBaseProductAdapter
);

const router = Router();

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
