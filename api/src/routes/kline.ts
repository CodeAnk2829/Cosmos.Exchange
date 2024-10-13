import { Router } from "express";

export const klineRouter = Router();

klineRouter.get("/", async (req, res) => {
    try {
        res.json({});
    } catch(err) {
        console.error(err);
        res.status(404).json({
            ok: false
        });
    }
});