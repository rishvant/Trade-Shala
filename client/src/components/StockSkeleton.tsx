import { motion } from "framer-motion";

const StockSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#131722]">
      {/* Header Skeleton */}
      <div className="bg-[#1E222D] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-64 bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="animate-pulse">
                <div className="h-8 w-32 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1E222D] p-6 rounded-2xl shadow-lg border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-16 bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="h-[400px] bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="bg-[#1E222D] p-6 rounded-2xl shadow-lg border border-gray-800">
              <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#262932] p-4 rounded-xl">
                    <div className="h-4 w-20 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trading Panel Skeleton */}
          <div className="bg-[#1E222D] p-6 rounded-2xl shadow-lg border border-gray-800">
            <div className="h-8 w-40 bg-gray-700 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSkeleton;
