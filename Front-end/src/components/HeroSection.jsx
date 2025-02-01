import React from 'react'
import { Search } from "lucide-react";
import image from "../ttt.jpg";
const MarketTicker = ({ icon, symbol, value, change }) => (
  <div className="flex items-center bg-[#4c4f555d] rounded-lg px-4 py-2 space-x-2 hover:bg-[#0c0e117a] hover:cursor-pointer">
    {icon}
    <div className="flex items-center space-x-2">
      <span className="text-white font-medium">{symbol}</span>
      <span className={`${change >= 0 ? "text-green-500" : "text-red-500"}`}>
        {change >= 0 ? "+" : ""}
        {change}%
      </span>
    </div>
  </div>
);
const HeroSection = () => {
  return (
    <div>
      <div className="relative min-h-screen bg-gradient-to-br from-[#131722] to-[#1e222d] overflow-hidden">
        <img
          src={image}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />

        
        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-4xl">
            
            <h1 className="text-6xl font-bold text-white mb-4 leading-tight">
              Look first /<br />
              Then leap.
            </h1>

            
            <p className="text-xl text-gray-300 mb-8">
              The best trades require research, then commitment.
            </p>

            
            <div className="relative max-w-2xl mb-12">
              <input
                type="text"
                placeholder="Search markets here"
                className="w-full px-6 py-4 bg-white rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>

            
            <div className="flex space-x-4 overflow-x-auto pb-4">
              <MarketTicker
                icon={
                  <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center">
                    ₿
                  </div>
                }
                symbol="BTCUSD"
                value="44,123"
                change={1.44}
              />
              <MarketTicker
                icon={
                  <div className="w-6 h-6 rounded-full bg-[#2962ff] flex items-center justify-center">
                    50
                  </div>
                }
                symbol="NIFTY"
                value="21,000"
                change={0.37}
              />
              <MarketTicker
                icon={
                  <div className="w-6 h-6 rounded-full bg-[#2962ff] flex items-center justify-center">
                    B
                  </div>
                }
                symbol="BANKNIFTY"
                value="46,500"
                change={0.3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection