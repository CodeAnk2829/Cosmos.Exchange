import { Router } from "express";

export const tickerRouter = Router();

tickerRouter.get("/", async (req, res) => {
    try {
        const { market } = req.query;
        // TODO: get the ticker
        res.json({});
    } catch(err) {
        console.error(err);
        res.status(404).json({
            ok: false
        });
    }
});