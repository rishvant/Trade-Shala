import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { createStrategy, fetchStrategy } from "@/services/stockService";
import { toast } from "sonner";

interface Strategy {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
  };
  stock_symbol: string;
  trade_type: string;
  strategy_date: string;
  target: string;
  sl: number;
  price: number;
  createdAt: string;
}

const Marketplace: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    author: localStorage.getItem("user_id") || "",
    description: "",
    stock_symbol: "",
    trade_type: "",
    strategy_date: "",
    target: "",
    sl: 0,
    price: 0,
  });

  const fetchStrategies = async () => {
    try {
      const response = await fetchStrategy();
      setStrategies(response.data);
    } catch (err) {
      setError("Failed to fetch strategies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleAddStrategy = async () => {
    try {
      console.log("formData", formData);
      const response = await createStrategy(formData);
      if (response.status === 201) {
        toast.success("Strategy added successfully.");
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          author: "",
          strategy_date: "",
          stock_symbol: "",
          trade_type: "",
          target: "",
          sl: 0,
          price: 0,
        });
        fetchStrategies();
      }
    } catch (err) {
      setError("Failed to add strategy.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Marketplace Strategies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies?.map((strategy) => (
          <div key={strategy.id} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{strategy.title}</h2>
            <p className="text-gray-700 mb-2">{strategy.description}</p>
            <p className="text-gray-500 mb-1">
              <strong>Stock Symbol:</strong> {strategy.stock_symbol}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Trade Type:</strong> {strategy.trade_type}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Strategy Date:</strong>{" "}
              {format(new Date(strategy.createdAt), "dd MMM yyyy")}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Target:</strong> {strategy.target}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Stop Loss:</strong> {strategy.sl}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Price:</strong> ₹{strategy.price}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Author:</strong> {strategy.author.name}
            </p>
            <p className="text-gray-400 text-sm">
              Posted on {format(new Date(strategy.createdAt), "dd MMM yyyy")}
            </p>
          </div>
        ))}
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed top-24 right-6 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-800 text-lg"
      >
        Add your strategy
      </button>

      {/* Modal for Adding New Strategy */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Strategy</h2>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            ></textarea>
            <input
              type="text"
              name="stock_symbol"
              value={formData.stock_symbol}
              onChange={handleChange}
              placeholder="Stock Symbol"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <select
              name="trade_type"
              value={formData.trade_type}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="CE">Call Option (CE)</option>
              <option value="PE">Put Option (PE)</option>
            </select>
            <input
              type="date"
              name="strategy_date"
              value={formData.strategy_date}
              onChange={handleChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="Target Price"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="sl"
              value={formData.sl}
              onChange={handleChange}
              placeholder="Stop Loss"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStrategy}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
