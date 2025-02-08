import React from "react";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { motion } from "framer-motion";

interface Position {
  id: string;
  symbol: string;
  type: "INTRADAY" | "DELIVERY" | "FUTURES" | "OPTIONS";
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  // Additional fields for F&O
  expiryDate?: string;
  strikePrice?: number;
  optionType?: "CALL" | "PUT";
  // Trade details
  tradeDate: string;
  lastUpdated: string;
}

interface CurrentPositionsProps {
  positions: Position[];
  onClosePosition: (positionId: string) => Promise<void>;
}

const CurrentPositions: React.FC<CurrentPositionsProps> = ({
  positions,
  onClosePosition,
}) => {
  const handleClosePosition = async (positionId: string) => {
    try {
      await onClosePosition(positionId);
    } catch (error) {
      console.error("Error closing position:", error);
      alert("Failed to close position. Please try again.");
    }
  };

  return (
    <div className="bg-[#1E222D] rounded-lg shadow-lg border border-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Current Positions</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">
            Total P&L:
            <span
              className={`ml-2 font-semibold ${
                positions.reduce((total, pos) => total + pos.pnl, 0) >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ₹{positions.reduce((total, pos) => total + pos.pnl, 0).toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          {positions.map((position) => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#262B3D] rounded-lg p-4 hover:bg-[#2A2F44] transition-colors relative group"
            >
              {/* Position Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-white font-semibold">
                      {position.symbol}
                    </h4>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        position.type === "INTRADAY"
                          ? "bg-blue-500/20 text-blue-400"
                          : position.type === "DELIVERY"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {position.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Qty: {position.quantity} | Avg: ₹
                    {position.avgPrice.toFixed(2)}
                  </p>
                </div>

                {/* Close Position Button */}
                <button
                  onClick={() => handleClosePosition(position.id)}
                  className="z-10 top-2 absoluteright-2 p-1 rounded-full hover:bg-red-500/20 transition-all"
                  title="Close Position"
                >
                  <X className="h-4 w-4 text-red-400" />
                </button>
              </div>

              {/* Position Details */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-right">
                  <p className="text-white">
                    ₹{position.currentPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm flex items-center justify-end ${
                      position.pnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {position.pnl >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {position.pnl >= 0 ? "+" : ""}₹
                    {Math.abs(position.pnl).toFixed(2)} (
                    {position.pnl >= 0 ? "+" : ""}
                    {position.pnlPercentage.toFixed(2)}%)
                  </p>
                </div>

                {/* F&O Specific Details */}
                {(position.type === "FUTURES" ||
                  position.type === "OPTIONS") && (
                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Expiry:</span>
                        <span className="text-white ml-2">
                          {new Date(position.expiryDate!).toLocaleDateString()}
                        </span>
                      </div>
                      {position.type === "OPTIONS" && (
                        <>
                          <div>
                            <span className="text-gray-400">Strike:</span>
                            <span className="text-white ml-2">
                              ₹{position.strikePrice?.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white ml-2">
                              {position.optionType}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Trade Time Details */}
                <div className="col-span-2 mt-2 text-xs text-gray-500">
                  <span>
                    Opened: {new Date(position.tradeDate).toLocaleString()}
                  </span>
                  <span className="ml-4">
                    Last Updated:{" "}
                    {new Date(position.lastUpdated).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {positions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No open positions
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPositions;
