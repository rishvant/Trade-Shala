import React, { useState, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import image from "../assets/ttt.jpg";
import { MarketTickerProps } from "../types/types";
import { motion } from "framer-motion";
import { searchStockData } from "../services/stockService";
import { useNavigate } from "react-router-dom";
import CurrentPositions from "./CurrentPositions";

// Define the props interface for MarketTicker
const MarketTicker: React.FC<MarketTickerProps> = ({
  icon,
  symbol,
  value = "0",
  change = 0,
}) => (
  <div className="flex items-center bg-[#4c4f555d] rounded-lg px-4 py-2 space-x-2 hover:bg-[#0c0e117a] hover:cursor-pointer">
    {icon}
    <div className="flex items-center space-x-2">
      <span className="text-white font-medium">{symbol}</span>
      <span className={`${change >= 0 ? "text-green-500" : "text-red-500"}`}>
        {change >= 0 ? "+" : ""}
        {change}%
      </span>
    </div>
  </div>
);

// const GlitterEffect = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {[...Array(50)].map((_, i) => (
//         <motion.div
//           key={i}
//           initial={{
//             opacity: 0,
//             scale: 0,
//             x: Math.random() * window.innerWidth,
//             y: Math.random() * window.innerHeight,
//           }}
//           animate={{
//             opacity: [0, 0.8, 0],
//             scale: [0, Math.random() * 0.5 + 0.5, 0],
//             x: [
//               Math.random() * window.innerWidth,
//               Math.random() * window.innerWidth,
//               Math.random() * window.innerWidth,
//             ],
//             y: [
//               Math.random() * window.innerHeight,
//               Math.random() * window.innerHeight,
//               Math.random() * window.innerHeight,
//             ],
//           }}
//           transition={{
//             duration: Math.random() * 3 + 2,
//             repeat: Infinity,
//             repeatDelay: Math.random() * 1,
//             ease: "easeInOut",
//           }}
//           className="absolute w-1 h-1 bg-white rounded-full"
//           style={{
//             filter: `blur(${Math.random() * 2}px)`,
//             boxShadow: `
//               0 0 ${Math.random() * 4 + 2}px #fff,
//               0 0 ${Math.random() * 8 + 4}px #fff,
//               0 0 ${Math.random() * 12 + 8}px rgba(255,255,255,0.5)
//             `,
//             backgroundColor: `hsl(${Math.random() * 60 + 180}, 100%, 90%)`,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  const handleSearch = async (value: string) => {
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Debounce search with shorter timeout (200ms)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await searchStockData(value);
        setSearchResults(
          Object.entries(response.data)
            .map(([symbol, name]) => ({
              symbol,
              name,
            }))
            .slice(0, 8) // Limit to 8 results for better performance
        );
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200); // Reduced from default 300ms to 200ms
  };

  const handleStockSelect = (symbol: string) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/stock/${symbol}`);
  };

  return (
    <div>
      <div className="sm:px-8 relative min-h-screen bg-gradient-to-br from-[#131722] to-[#1e222d] overflow-hidden">
        {/* <img
          src={image}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        <div className="w-1/2 absolute inset-0">
          <CurrentPositions
            positions={[]}
            onClosePosition={() => Promise.resolve()}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />

        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 leading-tight">
              Look first /<br />
              Then leap.
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8">
              The best trades require research, then commitment.
            </p>

            <div className="relative max-w-2xl mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for stocks..."
                  className="w-full px-12 py-4 bg-white rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(({ symbol, name }) => (
                      <motion.button
                        key={symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleStockSelect(symbol)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center justify-between group transition-colors duration-150"
                      >
                        <div>
                          <div className="text-black font-medium">{symbol}</div>
                          <div className="text-sm text-gray-600">{name}</div>
                        </div>
                        <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          View →
                        </span>
                      </motion.button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-600">
                      No stocks found
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-4">
              <MarketTicker
                icon={
                  <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center">
                    ₿
                  </div>
                }
                symbol="BTCUSD"
                value="44,123"
                change={1.44}
              />
              <MarketTicker
                icon={
                  <div className="w-6 h-6 rounded-full bg-[#2962ff] flex items-center justify-center">
                    50
                  </div>
                }
                symbol="NIFTY"
                value="21,000"
                change={0.37}
              />
              <MarketTicker
                icon={
                  <div className="w-6 h-6 rounded-full bg-[#2962ff] flex items-center justify-center">
                    B
                  </div>
                }
                symbol="BANKNIFTY"
                value="46,500"
                change={0.3}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <GlitterEffect /> */}
    </div>
  );
};

export default HeroSection;
