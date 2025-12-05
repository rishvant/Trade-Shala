import { useState, useEffect } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { searchStockData } from "@/services/stockService";

// Popular search suggestions
const popularSearches = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
    "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK"
];

// Initial popular stocks to display
const initialPopularStocks = [
    { tradingsymbol: "RELIANCE", name: "Reliance Industries Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "TCS", name: "Tata Consultancy Services Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "HDFCBANK", name: "HDFC Bank Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "INFY", name: "Infosys Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "ICICIBANK", name: "ICICI Bank Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "HINDUNILVR", name: "Hindustan Unilever Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "ITC", name: "ITC Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "SBIN", name: "State Bank of India", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "BHARTIARTL", name: "Bharti Airtel Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "KOTAKBANK", name: "Kotak Mahindra Bank Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "LT", name: "Larsen & Toubro Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "AXISBANK", name: "Axis Bank Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "ASIANPAINT", name: "Asian Paints Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "MARUTI", name: "Maruti Suzuki India Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "TITAN", name: "Titan Company Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "WIPRO", name: "Wipro Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "ULTRACEMCO", name: "UltraTech Cement Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "NESTLEIND", name: "Nestle India Limited", exchange: "NSE", instrument_type: "EQ" },
    { tradingsymbol: "BAJFINANCE", name: "Bajaj Finance Limited", exchange: "NSE", instrument_type: "EQ" },
];

const Stocks = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [stocks, setStocks] = useState<any[]>(initialPopularStocks);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Debounced search
    useEffect(() => {
        const searchStocks = async () => {
            if (searchQuery.trim().length < 2) {
                setStocks(initialPopularStocks);
                return;
            }

            setLoading(true);
            try {
                const response = await searchStockData(searchQuery);
                // API returns an object like { "SYMBOL": "Company Name", ... }
                // Convert it to array of objects
                if (response.data && typeof response.data === 'object') {
                    const stockArray = Object.entries(response.data).map(([symbol, name]) => ({
                        tradingsymbol: symbol,
                        name: name as string,
                        exchange: "NSE",
                        instrument_type: "EQ"
                    }));
                    setStocks(stockArray);
                } else {
                    setStocks(initialPopularStocks);
                }
            } catch (error) {
                console.error("Error searching stocks:", error);
                setStocks(initialPopularStocks);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchStocks, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handlePopularSearch = (symbol: string) => {
        setSearchQuery(symbol);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0b0d] via-[#131722] to-[#0a0b0d] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Explore Stocks
                    </h1>
                    <p className="text-gray-400 text-lg">Search and discover stocks to trade</p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stocks by name or symbol (e.g., RELIANCE, TCS)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-[#1E222D] text-white rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-all"
                        />
                        {loading && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 animate-spin" />
                        )}
                    </div>
                </motion.div>

                {/* Popular Searches */}
                {!searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h3 className="text-gray-400 text-sm mb-3">Popular Searches:</h3>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map((symbol) => (
                                <button
                                    key={symbol}
                                    onClick={() => handlePopularSearch(symbol)}
                                    className="px-4 py-2 bg-[#1E222D] text-gray-300 rounded-lg border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all"
                                >
                                    {symbol}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Results */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {!searchQuery && (
                        <h2 className="text-2xl font-bold text-white mb-6">Popular Stocks</h2>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">Searching stocks...</p>
                            </div>
                        </div>
                    ) : stocks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stocks.map((stock, index) => (
                                <motion.div
                                    key={stock.tradingsymbol || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => navigate(`/stock/${stock.tradingsymbol}`)}
                                    className="bg-gradient-to-br from-[#1E222D] to-[#262B3D] p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                {stock.tradingsymbol}
                                            </h3>
                                            <p className="text-gray-400 text-sm line-clamp-1">{stock.name}</p>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                            {stock.exchange}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                            {stock.instrument_type}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg mb-2">No stocks found</p>
                            <p className="text-gray-500 text-sm">Try searching for popular stocks like RELIANCE, TCS, or INFY</p>
                        </div>
                    )}
                </motion.div>

                {/* Info Footer */}
                {stocks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                    >
                        <p className="text-blue-400 text-sm">
                            💡 <strong>Tip:</strong> Click on any stock to view detailed charts, place orders, and analyze technical indicators.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Stocks;
