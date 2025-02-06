import { useState, useEffect } from "react";
import { Clock, ArrowUpDown } from "lucide-react";
import StockChart from "../components/StockChart";
import TradingPanel from "../components/TradingPanel";
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

function Stock() {
  const { stockName } = useParams<{ stockName: any }>();
  const [timeRange, setTimeRange] = useState<string>("1D");
  const [stockData, setStockData] = useState<any[]>([]);
  const [marketStatus, setMarketStatus] = useState<string>("closed");
  const [stockNameData, setStockNameData] = useState<StockName>({
    shortName: "",
    fullName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStockData(stockName);
        console.log(response);
        const transformedData = transformCandleData(response.data.data);
        setStockData(transformedData);
        setMarketStatus(response.data.marketStatus);
      } catch (error) {
        console.error("Error fetching stock data:", error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ArrowUpDown className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                StockTrader Pro
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span
                className={`${
                  marketStatus === "open" ? "text-green-600" : "text-red-600"
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
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {stockNameData.shortName}
                  </h2>
                  <p className="text-gray-600">{stockNameData.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    ₹{currentPrice.toFixed(2)}
                  </p>
                  <p
                    className={`${
                      priceChange >= 0 ? "text-green-600" : "text-red-600"
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
                      className={`px-4 py-2 rounded-md ${
                        timeRange === range
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Key Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600">Open</p>
                  <p className="font-bold">
                    ₹{stockData[0]?.price.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">High</p>
                  <p className="font-bold">
                    ₹{Math.max(...stockData.map((d) => d.price)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Low</p>
                  <p className="font-bold">
                    ₹{Math.min(...stockData.map((d) => d.price)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Volume</p>
                  <p className="font-bold">
                    {(
                      (stockData[stockData.length - 1]?.volume || 0) / 1000
                    ).toFixed(1)}
                    K
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <TradingPanel currentPrice={currentPrice} symbol="AAPL" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Stock;
