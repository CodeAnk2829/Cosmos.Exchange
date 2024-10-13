"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { checkEqualForDecreasing, checkEqualForIncreasing } from "../../utils/isEqual"

export function Depth({ market }: { market: string }) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        getDepth(market).then(d => {
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            setBids((originalBids) => {
                let bidsAfterUpdate = [...(originalBids || [])];
                console.log("bids:  ", bidsAfterUpdate);
                console.log("data.bids: ", data.bids);
                for (let j = 0; j < data.bids.length; j++) {
                    if (data.bids[j][1] === '0.00') {
                        data.bids = data.bids.splice(j, 1);
                    } else if (checkEqualForDecreasing(bidsAfterUpdate, data.bids[j])) {
                        break;
                    }
                }

                return bidsAfterUpdate;
            });

            setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];
                console.log("asks: ", asksAfterUpdate);
                console.log("data.asks", data.asks);
                for (let j = 0; j < data.asks.length; j++) {
                    if (data.asks[j][1] === '0.00') {
                        data.asks = data.asks.splice(j, 1);
                    } else if (checkEqualForIncreasing(asksAfterUpdate, data.asks[j])) {
                        break;
                    }
                }

                return asksAfterUpdate;
            });
        }, `DEPTH-${market}`);

        SignalingManager.getInstance().sendMessage({ "method": "SUBSCRIBE", "params": [`depth.200ms.${market}`] });


        // getTicker(market).then(t => setPrice(lastPrice => lastPrice = t.lastPrice));
        getTrades(market).then(t => setPrice(t[0].price));
        // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
        return () => {
            SignalingManager.getInstance().sendMessage({ "method": "UNSUBSCRIBE", "params": [`depth.200ms.${market}`] });
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
        }
    }, [])

    return <div className="flex flex-col no-scrollbar h-full flex-1 snap-mandatory">
        <TableHeader market={market}/>
        {asks && <AskTable asks={asks} />}
        {price && <div className="pl-1.5">{price}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader({ market }: { market: string }) {
    return <div className="grid grid-cols-3 text-sm px-1">
        <div className="text-white">Price({market.split("_")[1]})</div>
        <div className="text-slate-500 text-right">Size({market.split("_")[0]})</div>
        <div className="text-slate-500 text-right">Total({market.split("_")[0]})</div>
    </div>
}