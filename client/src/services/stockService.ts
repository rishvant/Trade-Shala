import axios from "axios";
import { API_BASE_URL } from "./API";

export const fetchStockData = async (path: string) => {
  try {
    console.log("Fetching from:", `${API_BASE_URL}/stocks/${path}`); // Debug log
    const response = await axios.get(`${API_BASE_URL}/stocks/${path}`);
    return response;
  } catch (error: any) {
    console.error("Error fetching stock data:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
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
    const response = await axios.get(
      `${API_BASE_URL}/portfolio/user/${user_id}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};

export const createStrategy = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/strategy`, data);
    return response;
  } catch (error) {
    console.error("Error creating strategy:", error);
    throw error;
  }
};

export const fetchStrategy = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/strategy`
    );
    return response;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    throw error;
  }
};
