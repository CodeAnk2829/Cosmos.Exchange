import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_DEPTH } from "../types";

export const depthRouter = Router();

depthRouter.get("/", async (req, res) => {
    try {
        const{ symbol }= req.query;
        const response = await RedisManager.getInstance().sendAndAwait({
            type: GET_DEPTH,
            data: {
                market: symbol as string
            }
        });

        res.status(200).json(response.payload);
    } catch(err) {
        console.error(err);
        res.status(404).json({
            ok: false
        });
    }
});