import { createContext, useState, useContext, ReactNode } from "react";

interface TradeContextType {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

export const TradeContext = createContext<TradeContextType | null>(null);

// export const useTrade = () => {
//   const trade = useContext(TradeContext);
//   if (!trade) {
//     throw new Error("useTrade must be used within a TradeProvider");
//   }
//   return trade;
// };

interface TradeProviderProps {
  children: ReactNode; // Define the type for children
}

export const TradeProvider: React.FC<TradeProviderProps> = (props) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <TradeContext.Provider value={{ isLogin, setIsLogin }}>
      {props.children}
    </TradeContext.Provider>
  );
};
