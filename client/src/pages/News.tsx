import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaNewspaper, FaExternalLinkAlt } from "react-icons/fa";

interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  related: string;
  source: string;
  summary: string;
  url: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://finnhub.io/api/v1/news?category=general&token=cufk499r01qno7m5ve60cufk499r01qno7m5ve6g"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#131722] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <FaNewspaper className="text-4xl text-green-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Market News</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest market insights and news
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-[#1E222D] rounded-xl overflow-hidden border border-green-500/20 hover:border-green-500/40 transition-colors duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-white mb-3 flex-1">
                    {item.headline}
                  </h2>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400 ml-4"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-400">
                    {new Date(item.datetime * 1000).toLocaleString()}
                  </span>
                  <span className="text-sm px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                    {item.category || "Market News"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading State */}
        {loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-pulse text-gray-400">
              Loading market news...
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;
