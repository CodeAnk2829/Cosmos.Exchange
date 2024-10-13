
export const BidTable = ({ bids }: {bids: [string, string][]}) => {
    let currentTotal = 0; 
    const relevantBids = bids.slice(0, 9);
    const bidsWithTotal: [string, string, number][] = relevantBids.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return <div>
        {bidsWithTotal?.map(([price, quantity, total]) => <Bid maxTotal={maxTotal} total={total} key={price} price={price} quantity={quantity} />)}
    </div>
}

function Bid({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return (
        <div
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
            background: "rgba(0, 194, 120, 0.16)",
            transition: "width 0.1s ease-in-out",
            }}
            ><div style={{ zIndex: "1", position: "absolute", top: "1px", bottom: "1px", right: "0px", width: `${(33 * total) / maxTotal}%`, background: "rgba(0, 194, 120, 0.32)", transition: "width 0.2s ease-in-out" }}></div></div>
            <div className={`grid grid-cols-3 text-sm w-full pt-0.5 font-medium text-right`}>
                <div style={{ color: "rgba(0, 194, 120, 0.9)"}} className="text-left pl-1">
                    {price}
                </div>
                <div style={{ color: "rgba(244, 244, 246, 0.8)" }}>
                    {quantity}
                </div>
                <div style={{ color: "rgba(244, 244, 246, 0.8)" }} className="pr-1">
                    {total.toFixed(2)}
                </div>
            </div>
        </div>
        
    );
}
