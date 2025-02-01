import { useState } from "react";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";

const WalletPage = () => {
  const [balance, setBalance] = useState(25000);
  const transactions = [
    { id: 1, type: "Deposit", amount: 5000, date: "2025-01-30" },
    { id: 2, type: "Withdrawal", amount: 2000, date: "2025-01-28" },
    { id: 3, type: "Deposit", amount: 10000, date: "2025-01-25" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <FaWallet className="text-3xl text-blue-500" />
          <h2 className="text-xl font-semibold">My Wallet</h2>
        </div>

        <div className="text-center text-2xl font-bold my-4">
          ₹{balance.toLocaleString()}
        </div>

        <div className="flex space-x-4 justify-center">
          <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            <FaArrowDown />
            <span>Deposit</span>
          </button>
          <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            <FaArrowUp />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <ul className="space-y-3 mt-3">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex justify-between p-3 border-b">
              <span
                className={`font-medium ${
                  tx.type === "Deposit" ? "text-green-500" : "text-red-500"
                }`}
              >
                {tx.type}
              </span>
              <span>₹{tx.amount.toLocaleString()}</span>
              <span className="text-gray-500">{tx.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WalletPage;
