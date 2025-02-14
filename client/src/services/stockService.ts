import axios from "axios";
import { API_BASE_URL } from "./API";

export const fetchStockData = async (symbol: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stocks/intraday/${symbol}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

export const searchStockData = async (symbol: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stocks/stockdata/search?symbol=${symbol}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

export const fetchPortfolios = async (user_id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/user/${user_id}`);
    return response;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};
