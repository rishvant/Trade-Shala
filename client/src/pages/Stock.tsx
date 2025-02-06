import { useState, useEffect } from "react";
import { Clock, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import StockChart from "../components/StockChart";
import TradingPanel from "../components/TradingPanel";
import StockSkeleton from "../components/StockSkeleton";
import { fetchStockData, searchStockData } from "../services/stockService";
import { useParams } from "react-router-dom";
import { StockName } from "../types/types";
import { io } from "socket.io-client";
import dayjs from "dayjs";

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

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  type: string;
  tradeType: "BUY" | "SELL";
  timestamp: string;
}

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
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchStockData(stockName);
        console.log(response);
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

  // Establish a WebSocket connection to listen to stock price updates
  useEffect(() => {
    const socket = io("http://localhost:3000"); // WebSocket connection

    // Handle market status updates
    socket.on("marketStatusChange", (status: string) => {
      console.log(status);
    });

    socket.emit("selectSymbol", stockName);

    socket.on("symbolData", (newData) => {
      if (newData && newData.type === "live_feed") {
        // Extract the dynamic stock key
        const stockKey = Object.keys(newData.feeds || {})[0];

        if (!stockKey) {
          console.log("No valid stock key found");
          return;
        }

        console.log(newData);

        const ohlcData =
          newData.feeds[stockKey]?.ff?.marketFF?.marketOHLC?.ohlc;

        console.log("OHLC Data:", ohlcData);

        if (!ohlcData) {
          console.log("No OHLC data found");
          return;
        }

        // Filter for daily interval data
        const filteredData = ohlcData.filter(
          (data: any) => data.interval === "1d"
        );

        if (filteredData.length === 0) {
          console.log("No matching 1d interval data");
          return;
        }

        // Transform data
        const transformedData = filteredData.map((data: any) => ({
          time: dayjs(data.time).format("YYYY-MM-DDTHH:mm:ssZ"),
          price: data.close,
          volume: data.volume,
        }));

        console.log("Transformed Data:", transformedData);

        // Merge and remove duplicates using a Map
        setStockData((prevData) => {
          const mergedData = [...prevData, ...transformedData];

          const uniqueData = Array.from(
            new Map(mergedData.map((item) => [item.time, item])).values()
          );

          // Sort data by timestamp
          return uniqueData.sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [stockName]);

  console.log(stockData);

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

  // Handler for new trades
  const handleNewTrade = (orderData: any) => {
    const { symbol, quantity, price, tradeType, type } = orderData;

    const newPosition: Position = {
      id: Date.now().toString(),
      symbol,
      quantity: Number(quantity),
      avgPrice: Number(price),
      currentPrice: Number(price),
      pnl: 0, // Will be calculated in real-time
      pnlPercentage: 0,
      type: type || "INTRADAY",
      tradeType,
      timestamp: new Date().toISOString(),
    };

    setPositions((prevPositions) => {
      // For buy orders, check and update existing positions
      if (tradeType === "BUY") {
        const existingPosition = prevPositions.find(
          (p) => p.symbol === symbol && p.tradeType === "BUY"
        );

        if (existingPosition) {
          return prevPositions.map((position) => {
            if (position.symbol === symbol && position.tradeType === "BUY") {
              const totalQuantity = position.quantity + Number(quantity);
              const newAvgPrice =
                (position.avgPrice * position.quantity + price * quantity) /
                totalQuantity;

              return {
                ...position,
                quantity: totalQuantity,
                avgPrice: newAvgPrice,
                currentPrice: price,
                pnl: (price - newAvgPrice) * totalQuantity,
                pnlPercentage: ((price - newAvgPrice) / newAvgPrice) * 100,
              };
            }
            return position;
          });
        }
      }

      // For both new BUY positions and all SELL positions, add as new entry
      return [...prevPositions, newPosition];
    });
  };

  // Update P&L when price changes
  useEffect(() => {
    if (currentPrice > 0) {
      setPositions((prevPositions) =>
        prevPositions.map((position) => {
          const pnl = (currentPrice - position.avgPrice) * position.quantity;
          const pnlPercentage =
            (pnl / (position.avgPrice * position.quantity)) * 100;

          return {
            ...position,
            currentPrice,
            pnl,
            pnlPercentage,
          };
        })
      );
    }
  }, [currentPrice]);

  if (isLoading) {
    return <StockSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#131722]">
      <header className="bg-[#1E222D] shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ArrowUpDown className="h-8 w-8 text-blue-500" />
              <h1 className="ml-2 text-2xl font-bold text-white">
                StockTrader Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="h-5 w-5 text-gray-400" />
              <span
                className={`${
                  marketStatus === "open" ? "text-green-400" : "text-red-400"
                }`}
              >
                Market {marketStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1E222D] p-6 rounded-lg shadow-lg border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {stockNameData.shortName}
                  </h2>
                  <p className="text-gray-400">{stockNameData.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    ₹{currentPrice.toFixed(2)}
                  </p>
                  <p
                    className={`${
                      priceChange >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex space-x-2">
                  {["1D", "1W", "1M", "3M", "1Y"].map((range) => (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        timeRange === range
                          ? "bg-blue-500 text-white"
                          : "bg-[#262B3D] text-gray-300 hover:bg-[#2A2F44]"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <StockChart
                data={[...stockData].sort((a, b) => a.time - b.time)}
                timeRange={timeRange}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-[#1E222D] p-6 rounded-lg shadow-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">
                  Key Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400">Open</p>
                    <p className="font-bold text-white">
                      ₹{stockData[0]?.price.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">High</p>
                    <p className="font-bold text-white">
                      ₹{Math.max(...stockData.map((d) => d.price)).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Low</p>
                    <p className="font-bold text-white">
                      ₹{Math.min(...stockData.map((d) => d.price)).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Volume</p>
                    <p className="font-bold text-white">
                      {(
                        (stockData[stockData.length - 1]?.volume || 0) / 1000
                      ).toFixed(1)}
                      K
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E222D] p-6 rounded-lg shadow-lg border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Current Positions
                  </h3>
                  <span className="text-sm text-gray-400">
                    Total P&L:
                    <span
                      className={`ml-2 font-semibold ${
                        positions.reduce((total, pos) => total + pos.pnl, 0) >=
                        0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      ₹
                      {positions
                        .reduce((total, pos) => total + pos.pnl, 0)
                        .toFixed(2)}
                    </span>
                  </span>
                </div>
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className="bg-[#262B3D] rounded-lg p-4 hover:bg-[#2A2F44] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-white font-semibold">
                              {position.symbol}
                            </h4>
                            <span
                              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                position.tradeType === "BUY"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {position.tradeType}
                            </span>
                            <span
                              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                position.type === "INTRADAY"
                                  ? "bg-blue-500/20 text-blue-400"
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
                        <div className="text-right">
                          <p className="text-white">
                            ₹{position.currentPrice.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm flex items-center justify-end ${
                              position.pnl >= 0
                                ? "text-green-400"
                                : "text-red-400"
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1E222D] rounded-lg shadow-lg border border-gray-800">
            <TradingPanel
              currentPrice={currentPrice}
              symbol={stockName}
              onTradeComplete={handleNewTrade}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Stock;
