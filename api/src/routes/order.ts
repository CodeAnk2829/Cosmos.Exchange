import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_OPEN_ORDERS } from "../types";

export const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
    try {
        const { market, price, quantity, side, userId } = req.body;
        console.log(req.body);
    
        const response = await RedisManager.getInstance().sendAndAwait({
            type: CREATE_ORDER,
            data: {
                market, 
                price, 
                quantity, 
                side,
                userId
            }
        });
    
        res.status(201).json(response.payload);
    } catch(err) {
        console.error(err);
        res.status(400).json({
            ok: false,
            error: err
        });
    }
});

orderRouter.delete("/", async (req, res) => {
    try {
        const { market, orderId } = req.body;
        const response = await RedisManager.getInstance().sendAndAwait({
            type: CANCEL_ORDER,
            data: {
                orderId,
                market
            }
        });
        res.status(200).json(response.payload);
    } catch(err) {
        console.error(err);
        res.status(400).json({
            ok: false
        });
    }
});

orderRouter.get("/open", async (req, res) => {
    try {
        const response = await RedisManager.getInstance().sendAndAwait({
            type: GET_OPEN_ORDERS,
            data: {
                market: req.query.market as string,
                userId: req.query.userId as string
            }
        });

        res.status(200).json(response.payload);
    } catch(err) {
        console.error(err);
        res.status(400).json({
            ok: false
        });
    }
});