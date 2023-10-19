import { Router } from "express";

const resetPassRouter = Router();

resetPassRouter.get("/",

    async (req, res, next) => {
        try {
            return res.render("resetPassword", {
                title: "Reset Password",
                script: "resetPass.js",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    });


export default resetPassRouter;