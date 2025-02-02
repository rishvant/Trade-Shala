import { createContext, useState, useContext, ReactNode } from "react";

interface TradeContextType {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

export const TradeContext = createContext<TradeContextType | null>(null);

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

export const TradeProvider: React.FC<TradeProviderProps> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <TradeContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </TradeContext.Provider>
  );
};
