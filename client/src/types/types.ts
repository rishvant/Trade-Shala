export interface CardProps {
  icon: React.ReactNode; // Type for the icon
  symbol: string; // Type for the symbol
  value: string; // Type for the value
  change: number; // Type for the change percentage
}

export interface MarketTickerProps {
  icon: React.ReactNode; // Type for the icon
  symbol: string; // Type for the symbol
  value: string; // Type for the value (assuming it's a string)
  change: number; // Type for the change percentage
}
