import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface TradingPanelProps {
  currentPrice: number;
  symbol: string;
}

const TradingPanel: React.FC<TradingPanelProps> = ({
  currentPrice,
  symbol,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState<number>(currentPrice);

  const totalAmount = currentPrice * quantity;

  const handleTrade = (action: "buy" | "sell") => {
    // Implement trade logic here
    console.log(
      `${action.toUpperCase()} ${quantity} ${symbol} at ${
        orderType === "market" ? "market price" : limitPrice
      }`
    );
  };

  return (
    <motion.div
      className="bg-[#1E222D] p-6 rounded-lg shadow-lg border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Place Order</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Order Type
          </label>
          <select
            className="mt-1 block w-full rounded-md bg-[#262932] text-white border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as "market" | "limit")}
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 ">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full rounded-md bg-[#262932] text-white border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 p"
          />
        </div>

        {orderType === "limit" && (
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Limit Price
            </label>
            <input
              type="number"
              step="0.01"
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-[#262932] text-white border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => handleTrade("buy")}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} />
            Buy
          </button>
          <button
            onClick={() => handleTrade("sell")}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <TrendingDown size={20} />
            Sell
          </button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Estimated Total:</span>
          <span className="text-xl font-bold text-white">
            ₹{(currentPrice * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-400 text-center mt-4">
        Available Balance: ₹100,000.00
      </p>
    </motion.div>
  );
};

export default TradingPanel;
