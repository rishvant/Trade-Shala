import { depositBalance, fetchBalance } from "@/services/walletService";
import { Order, TradeContextType } from "@/types/types";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Create the context
export const TradeContext = createContext<TradeContextType | null>(null);

// Custom hook for using the trade context
export const useTrade = () => {
  const trade = useContext(TradeContext);
  if (!trade) {
    throw new Error("useTrade must be used within a TradeProvider");
  }
  return trade;
};

interface TradeProviderProps {
  children: ReactNode;
}

// Generate unique ID for orders
const generateOrderId = () =>
  `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const TradeProvider: React.FC<TradeProviderProps> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [balance, setBalance] = useState(0);
  const [positions, setPositions] = useState<
    Map<string, { quantity: number; averagePrice: number }>
  >(new Map());

  // Add a new order
  const addOrder = (
    orderData: Omit<Order, "id" | "timestamp" | "status" | "total" | "pnl">
  ) => {
    const total = orderData.price * orderData.quantity;

    // Check if enough balance for buy orders
    if (orderData.action === "buy" && total > balance) {
      throw new Error("Insufficient balance");
    }

    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(),
      timestamp: new Date(),
      status: "completed",
      total: total,
      pnl: 0,
    };

    setOrders((prevOrders) => {
      const updatedOrders = [newOrder, ...prevOrders];
      return updatedOrders;
    });

    // Update balance
    setBalance((prev) =>
      orderData.action === "buy" ? prev - total : prev + total
    );

    // Update position
    updatePosition(
      orderData.symbol,
      orderData.action === "buy" ? orderData.quantity : -orderData.quantity,
      orderData.price
    );
  };

  // Cancel an order
  const cancelOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );

    // Find the cancelled order and revert the balance
    const cancelledOrder = orders.find((order) => order.id === orderId);
    if (cancelledOrder && cancelledOrder.status === "pending") {
      const orderTotal = cancelledOrder.price * cancelledOrder.quantity;
      if (cancelledOrder.action === "buy") {
        setBalance((prev) => prev + orderTotal);
      } else {
        setBalance((prev) => prev - orderTotal);
      }
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      try {
        const latestBalance = await fetchBalance();
        setBalance(latestBalance.balance);
      } catch (err) {
        console.error("Failed to fetch balance from API:", err);
      }
    };

    getBalance();
  }, []);

  const refreshBalance = async () => {
    try {
      const latestBalance = await fetchBalance();
      setBalance(latestBalance);
    } catch (err) {
      console.error("Failed to refresh balance:", err);
    }
  };

  const depositOrWithdrawFunds = async (amount: number, type:string) => {
    try {
      const data = await depositBalance(amount, type);
      setBalance(data.updatedBalance);
    } catch (error) {
      console.error(`Failed to ${type} funds:`, error);
      throw error;
    }
  };

  // Get orders for a specific symbol
  const getOrdersBySymbol = (symbol: string) => {
    return orders.filter((order) => order.symbol === symbol);
  };

  // Update balance
  const updateBalance = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  // Update position
  const updatePosition = (symbol: string, quantity: number, price: number) => {
    setPositions((prevPositions) => {
      const newPositions = new Map(prevPositions);
      const currentPosition = newPositions.get(symbol) || {
        quantity: 0,
        averagePrice: 0,
      };

      const newQuantity = currentPosition.quantity + quantity;
      const newAveragePrice =
        quantity > 0
          ? (currentPosition.averagePrice * currentPosition.quantity +
              price * quantity) /
            newQuantity
          : currentPosition.averagePrice;

      if (newQuantity === 0) {
        newPositions.delete(symbol);
      } else {
        newPositions.set(symbol, {
          quantity: newQuantity,
          averagePrice: newAveragePrice,
        });
      }

      return newPositions;
    });
  };

  return (
    <TradeContext.Provider
      value={{
        isLogin,
        setIsLogin,
        orders,
        addOrder,
        cancelOrder,
        getOrdersBySymbol,
        balance,
        updateBalance,
        positions,
        updatePosition,
        depositOrWithdrawFunds,
        refreshBalance,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};
