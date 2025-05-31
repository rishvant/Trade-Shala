import axios from "axios";
import { API_BASE_URL } from "./API";

export const fetchBalance = async () => {
  const res = await axios.get(`${API_BASE_URL}/wallet/balance`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const getTransactions = async () => {
  const res = await axios.get(`${API_BASE_URL}/wallet/transactions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res;
};

export const depositBalance = async (amount: number, type: string) => {
  const res = await axios.post(
    `${API_BASE_URL}/wallet/depositOrWithdraw`,
    {
      amount,
      type,
    },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return res.data;
};
