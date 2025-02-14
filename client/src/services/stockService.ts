import axios from "axios";
import { API_BASE_URL } from "./API";

export const fetchStockData = async (path: string) => {
  try {
    const url = `${API_BASE_URL}/stocks/${path}`;
    const response = await axios.get(url);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    return response;
  } catch (error: any) {
    console.error("Error fetching stock data:", {
      message: error.message,
      url,
      response: error.response?.data,
    });
    throw error;
  }
};

export const searchStockData = async (symbol: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stocks/search?symbol=${symbol}`
    );
    return response;
  } catch (error: any) {
    console.error("Error searching stock data:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
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
