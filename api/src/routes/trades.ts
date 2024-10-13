import { Router } from "express";


export const tradeRouter = Router();

tradeRouter.get("/", async (req, res) => {
    try {
        const { market } = req.query;
        // get from DB
        res.json({});
    } catch(err) {
        console.error(err);
        res.status(404).json({
            ok: false
        });
    }
});