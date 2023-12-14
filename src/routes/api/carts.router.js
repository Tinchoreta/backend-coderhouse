import DataBaseCartManagerAdapter from "../../Business/adapters/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import CartManagerController from "../../controllers/CartManagerController.js";
import { checkProductExistenceInCart } from "../../middlewares/business/cartMiddleware.js";
import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import ROLES from "../../utils/userRoles.js";
import { cartMiddleware } from "../../middlewares/business/cartMiddleware.js";

const router = new CustomRouter();

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

router.get("/", [ROLES.ADMIN, ROLES.PUBLIC], (req, res) => cartController.getCarts(req, res));

router.post("/", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.PUBLIC], cartMiddleware, (req, res) => cartController.createCart(req, res));

router.get("/cartManager", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], (req, res) => cartController.getCartManager(req, res));

router.get("/cartByUserEmail/:email", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], (req, res) => cartController.getCartByUserEmail(req, res));


router.get("/:cartId", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], (req, res) => cartController.getCartById(req, res));

router.get('/:cartId/cartItemCount', [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], async (req, res) => {
    const itemCount = await cartController.getCartTotalItemsQuantity(req, res); 
});

router.get('/:cartId/cartTotal', [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], async (req, res) => {
    const total = await cartController.calculateCartTotalPrice(req, res);
});


router.get("/:cartId/bills", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], (req, res) => cartController.calculateCartTotalPrice(req, res));

router.get("/:cartId/purchase", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.PUBLIC], (req, res) => cartController.processPurchase(req, res));

router.delete("/:cartId/product/:productId", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], checkProductExistenceInCart, cartMiddleware, (req, res) => cartController.removeProductFromCart(req, res));

router.put("/:cartId/product/:productId/add/:units", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.PUBLIC], cartMiddleware, (req, res) => cartController.addProductUnitsToCart(req, res));

router.delete("/:cartId/product/:productId/remove/:units", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN, ROLES.PUBLIC], checkProductExistenceInCart, cartMiddleware, (req, res) => cartController.removeProductUnitsFromCart(req, res));




export default router;
