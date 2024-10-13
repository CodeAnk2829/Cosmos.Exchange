"use client";

import { useEffect, useState } from "react";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { getTrades } from "../utils/httpClient";
// import { Trade } from "../utils/types"

export function Trade({ market }: { market: string }) {
    const [parentHeight, setParentHeight] = useState("100px"); // Initial height
    const [priceColor, setPriceColor] = useState("rgba(0, 194, 120, 0.9)");

    return (
        <div
            className="grid grid-cols-3 no-scrollbar snap-mandatory overflow-y-hidden w-1/2"
            style={{ height: parentHeight }}
        >
            <div className="w-full">
                <TradeHeader market={market} />
                <div className="no-scrollbar ">
                    <TradeData market={market} setParentHeight={setParentHeight} setPriceColor={setPriceColor} textColor={priceColor}/>
                </div>
            </div>
        </div>
    );
}

function TradeHeader({ market }: { market: string }) {
    return (
        <div className="grid grid-cols-3 text-sm text-left pl-px text-baseTextMedEmphasis w-half">
            <div className="">
                Price({market.split("_")[1]})
            </div>
            <div className="text-right">
                Qty({market.split("_")[0]})
            </div>
        </div>
    );
}

function TradeData({
    market,
    setParentHeight,
    setPriceColor,
    textColor,
}: {
    market: string;
    setParentHeight: (height: string) => void;
    setPriceColor: any;
    textColor: string
}) {
    const [tradeData, setTradeData] = useState<[string, string, string][]>([]);
    useEffect(() => {
        const signalingManager = SignalingManager.getInstance();

        const handleTrade = (data: any) => {
            const date = new Date(data.time * 1000);

            // Extract hours, minutes, and seconds
            const hours = date.getUTCHours().toString().padStart(2, "0");
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            const seconds = date.getUTCSeconds().toString().padStart(2, "0");

            // Format the time as HH:MM:SS
            const formattedTime = `${hours}:${minutes}:${seconds}`;

            const newData: [string, string, string] = [data.price, data.qty, formattedTime];
            setTradeData((tradeData) => {
                const updatedData = [newData, ...tradeData];

                if(tradeData[0] > updatedData[0]) {
                    setPriceColor("rgba(253, 75, 78, 0.9)")
                } 

                if (updatedData.length >= 20) {
                    setParentHeight(`500px`);
                }

                return updatedData;
            });
        };

        signalingManager.registerCallback("trade", handleTrade, `TRADE-${market}`);
        signalingManager.sendMessage({ method: "SUBSCRIBE", params: [`trade.${market}`] });

        return () => {
            signalingManager.sendMessage({ method: "UNSUBSCRIBE", params: [`trade.${market}`] });
            signalingManager.deRegisterCallback("trade", `TRADE-${market}`);
        };
        // getTrades(market).then(t => setTemp(t));
    }, [market, setParentHeight]);

    return (
        <div>
            {tradeData.map(([price, qty, time], index) => (
                <div
                    key={index}
                    className="grid grid-cols-3 w-full cursor-default bg-transparent hover:bg-white/4 font-medium text-sm text-baseTextHighEmphasis/90"
                >
                    <div className=" py-2 !py-1">
                        <div className="tabular-nums text-redText px-1" style={{color: `${textColor}`}}>
                            {price}
                        </div>
                    </div>
                    <div className=" py-2 !py-1 text-right">
                        <div className="tabular-nums">
                            {qty}
                        </div>
                    </div>
                    <div className=" py-2 !py-1 text-right">
                        <div className="font-normal tabular-nums text-baseTextMedEmphasis">
                            {time}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
