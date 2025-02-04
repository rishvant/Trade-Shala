import { useState, useEffect } from "react";
import {
  Clock,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart2,
  Volume2,
} from "lucide-react";
import StockChart from "../components/StockChart";
import TradingPanel from "../components/TradingPanel";
import { fetchStockData, searchStockData } from "../services/stockService";
import { useParams } from "react-router-dom";
import { StockName } from "../types/types";
import Positions from "../components/Positions";
import { motion } from "framer-motion";
import StockSkeleton from "../components/StockSkeleton";

const transformCandleData = (data: any) => {
  if (!data?.candles) return [];

  return data.candles
    .map((candle: any[]) => ({
      time: candle[0],
      price: candle[4],
      volume: candle[5],
    }))
    .reverse();
};

function Stock() {
  const { stockName } = useParams<{ stockName: any }>();
  const [timeRange, setTimeRange] = useState<string>("1D");
  const [stockData, setStockData] = useState<any[]>([]);
  const [marketStatus, setMarketStatus] = useState<string>("closed");
  const [stockNameData, setStockNameData] = useState<StockName>({
    shortName: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchStockData(stockName);
        const transformedData = transformCandleData(response.data.data);
        setStockData(transformedData);
        setMarketStatus(response.data.marketStatus);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [stockName]);

  // New useEffect to fetch stock name
  useEffect(() => {
    const fetchStockNameData = async () => {
      try {
        const response = await searchStockData(stockName);
        const shortName = Object.keys(response.data)[0];
        const fullName = response.data[shortName];
        setStockNameData({
          shortName,
          fullName,
        });
      } catch (error) {
        console.error("Error fetching stock name:", error);
      }
    };

    fetchStockNameData();
  }, [stockName]);

  // Update data periodically if market is open
  useEffect(() => {
    if (marketStatus === "open") {
      const interval = setInterval(() => {
        // In a real app, fetch new data here
        // For now, we'll just update the last price slightly
        setStockData((prevData) => {
          if (prevData.length === 0) return prevData;
          const lastPrice = prevData[prevData.length - 1].price;
          const newPrice = lastPrice + (Math.random() - 0.5) * 2;
          const newData = [...prevData];
          newData[newData.length - 1] = {
            ...newData[newData.length - 1],
            price: newPrice,
          };
          return newData;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [marketStatus]);

  const currentPrice =
    stockData.length > 0 ? stockData[stockData.length - 1].price : 0;
  const previousPrice =
    stockData.length > 1 ? stockData[stockData.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice
    ? (priceChange / previousPrice) * 100
    : 0;

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    // In a real app, fetch new data for the selected time range
    // For now, we'll keep the same data
  };

  if (isLoading) {
    return <StockSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#131722]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1E222D] border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">
                  {stockNameData.shortName}
                </h1>
                <span className="px-2 py-1 text-sm bg-blue-500/20 text-blue-400 rounded">
                  NSE
                </span>
              </div>
              <p className="text-gray-400 text-sm">{stockNameData.fullName}</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ₹{currentPrice.toFixed(2)}
                </p>
                <div
                  className={`flex items-center gap-1 ${
                    priceChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {priceChange >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toFixed(2)}({priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-[#262932] rounded-lg">
                <Clock
                  size={16}
                  className={
                    marketStatus === "open" ? "text-green-500" : "text-red-500"
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    marketStatus === "open" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {marketStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E222D] p-6 rounded-2xl shadow-lg border border-gray-800"
            >
              {/* Time Range Selector */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Price Chart</h2>
                <div className="flex gap-2">
                  {["1D", "1W", "1M", "3M", "1Y"].map((range) => (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        timeRange === range
                          ? "bg-blue-600 text-white"
                          : "bg-[#262932] text-gray-400 hover:bg-[#2B2F3A]"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <StockChart data={stockData} timeRange={timeRange} />
            </motion.div>

            {/* Statistics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1E222D] p-6 rounded-2xl shadow-lg border border-gray-800"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                Market Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-[#262932] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Activity size={18} />
                    <span>Open</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    ₹{stockData[0]?.price.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-[#262932] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <TrendingUp size={18} />
                    <span>High</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    ₹{Math.max(...stockData.map((d) => d.price)).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#262932] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <TrendingDown size={18} />
                    <span>Low</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    ₹{Math.min(...stockData.map((d) => d.price)).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#262932] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Volume2 size={18} />
                    <span>Volume</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {(
                      (stockData[stockData.length - 1]?.volume || 0) / 1000
                    ).toFixed(1)}
                    K
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Positions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Positions />
            </motion.div>
          </div>

          {/* Right Column - Trading Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <TradingPanel
              currentPrice={currentPrice}
              symbol={stockNameData.shortName}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Stock;
