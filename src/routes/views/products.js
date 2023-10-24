import { Router } from "express";
import ProductViewController from "../../controllers/ProductViewController.js";
import CartManagerController from "../../controllers/CartManagerController.js";
import DataBaseCartManagerAdapter from "../../Business/adapters/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import HTTP_STATUS_CODES from "../../utils/httpStatusCodes.js";

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

const productRouter = Router();

// async function verifyToken(token) {
//     try {
//         return await jwt.verify(token, config.privateKeyJwt);
//     } catch (error) {
//         throw error;
//     }
// }

// productRouter.use(async (req, res, next) => {
//     const auth = req.headers?.authorization;
//     if (auth) {
//         const token = auth.split(' ')[1];
//         try {
//             const credentials = await verifyToken(token);
//             req.user = {
//                 email: credentials.email,
//                 role: credentials.role
//             };
//         } catch (error) {
//             req.user = null;
//         }
//     } else {
//         req.user = null;
//     }
//     next();
// });


productRouter.get("/", async (req, res, next) => {
    try {
        const productViewController = new ProductViewController();
        let userEmail = req.user ? req.user.email : null;

        // Si req.query.email está presente, lo usa en lugar de req.user.email
        if (req.query?.email) {
            userEmail = req.query.email;
        }

        if (userEmail) {
            const cart = await cartController.searchOrCreateCart(userEmail);

            if (cart) {
                const cartId = cart._id.toString();
                req.cartId = cartId;
                
                productViewController.renderProductsForm(req, res, cartId);
            } else {
                return res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error creating or retrieving cart."
                });
            }

        } else {
            productViewController.renderProductsForm(req, res, "");
        }
    } catch (error) {
        next(error);
    }
});



export default productRouter;
