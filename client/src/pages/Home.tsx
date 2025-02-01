import React, { useState } from "react";
import { ChartLineIcon, StarIcon } from "lucide-react";
import HeroSection from "../components/HeroSection";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../components/Card";

const Home = () => {
  const [activeTab, setActiveTab] = useState("indices");

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 1000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const cardData = [
    {
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#2962ff] flex items-center justify-center text-white">
          B
        </div>
      ),
      symbol: "BANKNIFTY",
      value: "46,500",
      change: 0.3,
    },
    {
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#ff5722] flex items-center justify-center text-white">
          N
        </div>
      ),
      symbol: "NIFTY50",
      value: "21,000",
      change: -0.2,
    },
    {
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#4caf50] flex items-center justify-center text-white">
          S
        </div>
      ),
      symbol: "SENSEX",
      value: "70,150",
      change: 0.5,
    },
    {
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#9c27b0] flex items-center justify-center text-white">
          D
        </div>
      ),
      symbol: "DOWJONES",
      value: "38,200",
      change: -0.1,
    },
    {
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#ffeb3b] flex items-center justify-center text-black">
          N
        </div>
      ),
      symbol: "NASDAQ",
      value: "15,400",
      change: 0.7,
    },
  ];

  const tabs = [
    { id: "indices", label: "Indices", icon: <ChartLineIcon /> },
    { id: "watchlist", label: "Watchlist", icon: <StarIcon /> },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <HeroSection />
      {/* ye ab aaya mere paas indices vaa section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "indices" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8">
              Market Indices
            </h2>
            <div className="overflow-hidden">
              <Slider {...settings}>
                {cardData.map((data, index) => (
                  <Card
                    key={index}
                    icon={data.icon}
                    symbol={data.symbol}
                    value={data.value}
                    change={data.change}
                  />
                ))}
              </Slider>
            </div>
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="text-center text-gray-400">
            <p>Abhi kuch nahi hai</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
