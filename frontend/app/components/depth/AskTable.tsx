import { relative } from "path";

export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 9);
    relevantAsks.reverse();
    const asksWithTotal: [string, string, number][] = relevantAsks.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    asksWithTotal.reverse();

    return <div>
        {asksWithTotal.map(([price, quantity, total]) => <Ask maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total} />)}
    </div>
}
function Ask({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return <div
        className="flex flex-col flex-1"
        style={{
            display: "flex",
            position: "relative",
            width: "100%",
            backgroundColor: "transparent",
            overflow: "hidden",
            padding: "2px"
        }}
    >
        <div
            style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: `${(50 * total) / maxTotal}%`,
                height: "100%",
                margin: "2px",
                background: "rgba(253, 75, 78, 0.16)",
                transition: "width 0.1s ease-in-out",
            }}
        >
            <div style={{ position: "absolute", top: "1px", bottom: "1px", right: "0px", width: `${(33 * total) / maxTotal}%`, background: "rgba(253, 75, 78, 0.32)", transition: "width 0.2s ease-in-out" }}></div>
        </div>
        <div className="text-sm text-right w-full pt-0.5 grid grid-cols-3">
            <div style={{ color: "rgba(253, 75, 78, 0.9)"}} className="text-left pl-1">
                {price}
            </div>
            <div style={{ color: "rgba(244, 244, 246, 0.8)"}}>
                {quantity}
            </div>
            <div style={{ color: "rgba(244, 244, 246, 0.8)"}} className="pr-1">
                {total?.toFixed(2)}
            </div>
        </div>
    </div>
}