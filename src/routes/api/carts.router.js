import { Router } from "express";
import DataBaseCartManagerAdapter from "../../Business/adapters/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import CartManagerController from "../../controllers/CartManagerController.js";
import { checkProductExistenceInCart } from "../../middlewares/business/cartMiddleware.js";

const router = Router();

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const dataBaseCartAdapter = DataBaseCartManagerAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const cartController = new CartManagerController(
    dataBaseCartAdapter,
    dataBaseProductAdapter
);

router.get("/", (req, res) => cartController.getCarts(req, res));
router.post("/", (req, res) => cartController.createCart(req, res));
router.get("/:cartId", (req, res) => cartController.getCartById(req, res));
router.get("/:cartId/bills", (req, res) => cartController.calculateCartTotalPrice(req, res));
router.get("/:cartId/purchase", (req, res) => cartController.processPurchase(req, res));
router.delete("/:cartId/product/:productId", checkProductExistenceInCart, (req, res) => cartController.removeProductFromCart(req, res));
router.put("/:cartId/product/:productId/add/:units", (req, res) => cartController.addProductUnitsToCart(req, res));
router.delete("/:cartId/product/:productId/remove/:units", checkProductExistenceInCart, (req, res) => cartController.removeProductUnitsFromCart(req, res));

export default router;
