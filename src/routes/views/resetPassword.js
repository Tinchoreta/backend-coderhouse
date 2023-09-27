import { Router } from "express";

const resetPassRouter = Router();

resetPassRouter.get("/",

    async (req, res, next) => {
        try {
            return res.render("forgetPass", {
                title: "Forget Pass",
                script: "forgetPass.js",
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