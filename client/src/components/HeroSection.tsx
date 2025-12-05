import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, BarChart3, ArrowRight, Activity, Clock, Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import CurrentPositions from "./CurrentPositions";
import { fetchPortfolios, fetchOrders } from "@/services/stockService";
import { useTrade } from "@/context/context";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { balance } = useTrade();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        const [portfolioResponse, ordersResponse] = await Promise.all([
          fetchPortfolios(user_id),
          fetchOrders(user_id)
        ]);

        setOrders(portfolioResponse.data[0]?.holdings || []);

        // Get recent orders (last 5)
        const allOrders = ordersResponse.data?.data || [];
        setRecentOrders(allOrders.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate real portfolio metrics
  const calculatePortfolioMetrics = () => {
    if (!orders || orders.length === 0) {
      return {
        totalValue: 0,
        totalPnL: 0,
        totalInvested: 0,
        pnlPercentage: 0,
      };
    }

    let totalInvested = 0;
    let totalCurrentValue = 0;

    orders.forEach((position: any) => {
      const avgPrice = position.average_price || position.execution_price || 0;
      const qty = position.quantity || 0;
      const currentPrice = position.current_price || avgPrice;

      totalInvested += avgPrice * qty;
      totalCurrentValue += currentPrice * qty;
    });

    const totalPnL = totalCurrentValue - totalInvested;
    const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return {
      totalValue: totalCurrentValue,
      totalPnL,
      totalInvested,
      pnlPercentage,
    };
  };

  const metrics = calculatePortfolioMetrics();

  // Parse user data from localStorage
  let userName = "Trader";
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      userName = userData.name || "Trader";
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  // Quick action cards
  const quickActions = [
    { icon: Search, label: "Explore Stocks", action: () => navigate("/stocks"), color: "blue" },
    { icon: Activity, label: "View Orders", action: () => navigate("/profile"), color: "purple" },
    { icon: Star, label: "Market News", action: () => navigate("/news"), color: "yellow" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0b0d] via-[#131722] to-[#0a0b0d] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <div className="relative container mx-auto px-4 pt-12 pb-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-400 text-lg">Here's what's happening with your investments today</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`p-4 rounded-xl bg-gradient-to-br from-[#1E222D] to-[#262B3D] border border-gray-700/50 hover:border-${action.color}-500/50 transition-all group`}
            >
              <action.icon className={`h-6 w-6 text-${action.color}-400 mb-2 mx-auto`} />
              <p className="text-white text-sm font-medium">{action.label}</p>
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Stats & Activity */}
          <div className="lg:col-span-5 space-y-6">
            {/* Portfolio Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-gray-300 text-sm font-medium">Available Balance</h3>
                </div>
                <p className="text-3xl font-bold text-white mb-1">₹{balance.toFixed(2)}</p>
                <p className="text-blue-400 text-sm">Ready to invest</p>
              </div>

              {/* Portfolio Value & P&L */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1c25]/80 backdrop-blur-sm rounded-xl border border-gray-700/30 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-medium">Invested</h3>
                  </div>
                  <p className="text-xl font-bold text-white">₹{metrics.totalInvested.toFixed(2)}</p>
                </div>

                <div className={`backdrop-blur-sm rounded-xl border p-5 ${metrics.totalPnL >= 0
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
                  }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg ${metrics.totalPnL >= 0 ? "bg-green-500/20" : "bg-red-500/20"
                      }`}>
                      {metrics.totalPnL >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <h3 className="text-gray-400 text-xs font-medium">Total P&L</h3>
                  </div>
                  <p className={`text-xl font-bold ${metrics.totalPnL >= 0 ? "text-green-400" : "text-red-400"
                    }`}>
                    {metrics.totalPnL >= 0 ? "+" : ""}₹{Math.abs(metrics.totalPnL).toFixed(2)}
                  </p>
                  <p className={`text-xs mt-1 ${metrics.totalPnL >= 0 ? "text-green-400/70" : "text-red-400/70"
                    }`}>
                    {metrics.pnlPercentage >= 0 ? "+" : ""}{metrics.pnlPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Current Value */}
              <div className="bg-[#1a1c25]/80 backdrop-blur-sm rounded-xl border border-gray-700/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Current Portfolio Value</h3>
                </div>
                <p className="text-2xl font-bold text-white">₹{metrics.totalValue.toFixed(2)}</p>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1c25]/80 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Recent Activity
                </h3>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: any, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#131722]/50 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${order.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"
                          }`}>
                          {order.type === "buy" ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.stock_symbol}</p>
                          <p className="text-gray-400 text-xs">
                            {order.quantity} shares • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          ₹{(order.execution_price || 0).toFixed(2)}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.order_status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : order.order_status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                          }`}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm mt-1">Start trading to see your activity here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Current Positions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="bg-[#1a1c25]/80 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Current Positions
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-gray-400">Live updates</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar pr-2">
                  <CurrentPositions
                    positions={orders}
                    onClosePosition={(id) => {
                      setOrders((prev) =>
                        prev.filter((order: any) => order._id !== id)
                      );
                      return Promise.resolve();
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
