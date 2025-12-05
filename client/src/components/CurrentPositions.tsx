import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import { SOCKET_BASE_URL } from "@/services/API";

interface Position {
  _id: string;
  stock_symbol: string;
  trade_category?: "intraday" | "delivery" | "futures" | "options";
  quantity: number;
  execution_price?: number;
  average_price: number;
  current_price?: number;
  pnl?: number;
  pnlPercentage?: number;
  type: "buy" | "sell";
  trade_type?: "buy" | "sell";
  order_type?: "market" | "limit";
  createdAt?: string;
  updatedAt?: string;
}

interface CurrentPositionsProps {
  positions: Position[];
  onClosePosition: (positionId: string) => Promise<void>;
}

const CurrentPositions: React.FC<CurrentPositionsProps> = ({
  positions,
  onClosePosition,
}) => {
  const [updatedPrices, setUpdatedPrices] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const socket = io(SOCKET_BASE_URL);

    socket.on("marketStatusChange", (status: string) => {
      console.log(status);
    });

    positions?.forEach((position) => {
      socket.emit("selectSymbol", position.stock_symbol);
    });

    socket.on("symbolData", (newData) => {
      if (newData && newData.type === "live_feed") {
        const stockKey = Object.keys(newData.feeds || {})[0];
        if (!stockKey) return;

        const ohlcData =
          newData.feeds[stockKey]?.ff?.marketFF?.marketOHLC?.ohlc;

        if (!ohlcData) return;

        const filteredData = ohlcData.filter(
          (data: any) => data.interval === "1d"
        );

        if (filteredData.length === 0) return;

        const transformedData = filteredData.map((data: any) => ({
          time: dayjs(data.time).format("YYYY-MM-DDTHH:mm:ssZ"),
          price: parseFloat(data.close),
        }));

        setUpdatedPrices((prev) => ({
          ...prev,
          [stockKey]:
            transformedData[transformedData.length - 1]?.price ||
            prev[stockKey],
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [positions]);

  const handleClosePosition = async (positionId: string) => {
    try {
      await onClosePosition(positionId);
    } catch (error) {
      console.error("Error closing position:", error);
      alert("Failed to close position. Please try again.");
    }
  };

  const totalPnL = positions?.reduce((acc, position) => {
    const currentPrice =
      updatedPrices[position.stock_symbol] || position.current_price || position.average_price || 0;
    const avgPrice = position.average_price || position.execution_price || 0;
    const qty = position.quantity || 0;

    if (!avgPrice || !qty) return acc;

    const tradeType = position.type || position.trade_type || "buy";
    const pnl =
      tradeType === "buy"
        ? (currentPrice - avgPrice) * qty
        : (avgPrice - currentPrice) * qty;
    return acc + pnl;
  }, 0) || 0;

  return (
    <div className="space-y-4">
      {positions?.length > 0 && (
        <div className="flex justify-between items-center mb-2">
          <span
            className={`text-sm font-semibold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"
              }`}
          >
            Total P&L: ₹{totalPnL.toFixed(2)}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {positions?.length > 0 ? (
          positions?.map((position) => {
            const currentPrice =
              updatedPrices[position.stock_symbol] ||
              position.current_price ||
              position.average_price ||
              position.execution_price ||
              0;

            const avgPrice = position.average_price || position.execution_price || 0;
            const qty = position.quantity || 0;
            const tradeType = position.type || position.trade_type || "buy";

            const pnl =
              tradeType === "buy"
                ? (currentPrice - avgPrice) * qty
                : (avgPrice - currentPrice) * qty;
            const pnlPercentage =
              avgPrice && qty ? (pnl / (avgPrice * qty)) * 100 : 0;

            return (
              <motion.div
                key={position._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#262B3D] rounded-lg p-4 hover:bg-[#2A2F44] transition-colors relative group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold text-lg">
                        {position.stock_symbol}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${tradeType === "buy"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                          }`}
                      >
                        {tradeType?.toUpperCase()}
                      </span>
                      {position.trade_category && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 font-medium">
                          {position.trade_category?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Qty: {qty} | Avg: ₹{avgPrice.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleClosePosition(position._id)}
                    className="p-1 rounded-full hover:bg-red-500/20 transition-all"
                    title="Close Position"
                  >
                    <X className="h-4 w-4 text-red-400" />
                  </button>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Price</p>
                    <p className="text-white font-semibold text-lg">₹{currentPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">P&L</p>
                    <p
                      className={`font-semibold text-lg flex items-center justify-end ${pnl >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {pnl >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {pnl >= 0 ? "+" : ""}₹{Math.abs(pnl).toFixed(2)}
                    </p>
                    <p className={`text-xs ${pnl >= 0 ? "text-green-400/70" : "text-red-400/70"}`}>
                      ({pnlPercentage.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No open positions</p>
            <p className="text-sm mt-2">Start trading to see your positions here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPositions;
