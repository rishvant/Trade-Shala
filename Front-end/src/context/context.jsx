import { createContext, useState, useContext } from "react";

export const TradeContext = createContext(null);

export const useTrade = () => {
  const trade = useContext(TradeContext);
  return trade;
};

export const TradeProvider = (props) => {
    const [isLogin, setIsLogin] = useState(true);
  return (
    <TradeContext.Provider value={{ isLogin, setIsLogin }}>
      {props.children}
    </TradeContext.Provider>
  );
};
