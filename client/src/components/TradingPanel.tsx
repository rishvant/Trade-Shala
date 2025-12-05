import React, { useState } from "react";
import { TrendingUp, TrendingDown, Hash, Target, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTrade } from "../context/context";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/services/API";
import { toast } from "sonner";

const socket = io(SOCKET_BASE_URL);

interface TradingPanelProps {
  currentPrice: number;
  symbol: string;
  onTradeComplete: (orderData: any) => void;
}

type TradeType = "INTRADAY" | "DELIVERY" | "FUTURES" | "OPTIONS";
type OrderType = "MARKET" | "LIMIT" | "SL" | "SL-M";

const TradingPanel: React.FC<TradingPanelProps> = ({
  currentPrice,
  symbol,
  onTradeComplete,
}) => {
  const { balance } = useTrade();
  const [tradeType, setTradeType] = useState<TradeType>("DELIVERY");
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(currentPrice);
  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // For F&O
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [strikePrice, setStrikePrice] = useState<number | null>(null);
  const [optionType, setOptionType] = useState<"CALL" | "PUT">("CALL");

  const totalAmount = currentPrice * quantity;
  const margin = tradeType === "INTRADAY" ? totalAmount * 0.2 : totalAmount;

  const handleTrade = (action: "buy" | "sell") => {
    if (isPlacingOrder) return;

    // Validate inputs
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (orderType === "LIMIT" && limitPrice <= 0) {
      toast.error("Limit price must be greater than 0");
      return;
    }

    setIsPlacingOrder(true);

    const orderData = {
      stock_symbol: symbol,
      order_type: orderType.toLowerCase(),
      order_category: tradeType.toLowerCase(),
      type: action,
      quantity,
      execution_price: currentPrice,
      limit_price: orderType === "LIMIT" ? limitPrice : undefined,
      user_id: localStorage.getItem("user_id"),
    };

    socket.emit("placeOrder", orderData);

    socket.once("orderPlaced", (response) => {
      setIsPlacingOrder(false);
      toast.success(response.message || "Order placed successfully!", {
        style: { background: "#064e3b", color: "white" },
      });
      onTradeComplete(response.order);
      resetForm();
    });

    socket.once("error", (error) => {
      setIsPlacingOrder(false);
      toast.error(error || "Failed to place order", {
        style: { background: "#7f1d1d", color: "white" },
      });
    });
  };

  const resetForm = () => {
    setQuantity(1);
    setLimitPrice(currentPrice);
    setStopLoss(null);
    setTarget(null);
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        Place Order
      </h2>

      <div className="space-y-5">
        {/* Trade Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Trade Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "DELIVERY", label: "Delivery", icon: "📦" },
              { value: "INTRADAY", label: "Intraday", icon: "⚡" },
              { value: "FUTURES", label: "Futures", icon: "📈" },
              { value: "OPTIONS", label: "Options", icon: "🎯" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setTradeType(type.value as TradeType)}
                className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${tradeType === type.value
                  ? "border-blue-500 bg-blue-500/20 text-blue-400"
                  : "border-gray-700 bg-[#131722] text-gray-400 hover:border-gray-600"
                  }`}
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
          {(tradeType === "INTRADAY" || tradeType === "FUTURES" || tradeType === "OPTIONS") && (
            <p className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {tradeType} trading: 9:15 AM - 3:30 PM IST
            </p>
          )}
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["MARKET", "LIMIT", "SL", "SL-M"].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type as OrderType)}
                className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${orderType === type
                  ? "border-purple-500 bg-purple-500/20 text-purple-400"
                  : "border-gray-700 bg-[#131722] text-gray-400 hover:border-gray-600"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Quantity
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-[#131722] text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-all font-medium"
              placeholder="Enter quantity"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              shares
            </div>
          </div>
        </div>

        {/* Limit Price */}
        {orderType !== "MARKET" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Limit Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 rounded-lg bg-[#131722] text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-all font-medium"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        {/* Stop Loss & Target */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stop Loss
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                value={stopLoss || ""}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-3 rounded-lg bg-[#131722] text-white border-2 border-gray-700 focus:border-red-500 focus:outline-none transition-all text-sm"
                placeholder="Optional"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                value={target || ""}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-3 rounded-lg bg-[#131722] text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none transition-all text-sm"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* F&O Specific Fields */}
        {tradeType === "OPTIONS" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-3 rounded-lg bg-[#131722] text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Strike Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={strikePrice || ""}
                    onChange={(e) => setStrikePrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-3 rounded-lg bg-[#131722] text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Option Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["CALL", "PUT"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOptionType(type as "CALL" | "PUT")}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${optionType === type
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-gray-700 bg-[#131722] text-gray-400 hover:border-gray-600"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => handleTrade("buy")}
            disabled={isPlacingOrder || balance < margin}
            className={`py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${isPlacingOrder || balance < margin
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 hover:scale-105"
              }`}
          >
            <TrendingUp size={20} />
            {isPlacingOrder ? "Placing..." : balance < margin ? "Insufficient Balance" : "Buy"}
          </button>
          <button
            onClick={() => handleTrade("sell")}
            disabled={isPlacingOrder}
            className={`py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${isPlacingOrder
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 hover:scale-105"
              }`}
          >
            <TrendingDown size={20} />
            {isPlacingOrder ? "Placing..." : "Sell"}
          </button>
        </div>

        {/* Insufficient Balance Warning */}
        {balance < margin && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">
              Insufficient balance. You need ₹{(margin - balance).toFixed(2)} more to place this order.
            </p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Order Value:</span>
            <span className="text-white font-semibold">₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Required Margin:</span>
            <span className="text-white font-semibold">₹{margin.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
            <span className="text-gray-400 text-sm">Available Balance:</span>
            <span className="text-green-400 font-bold text-lg">₹{balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Hide number input arrows */}
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </motion.div>
  );
};

export default TradingPanel;
