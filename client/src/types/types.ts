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

export interface StockName {
  shortName: string;
  fullName: string;
}

export interface GenerateOTPData {
  phoneNumber: string;
}

export interface GenerateEmailOTPData {
  email: string;
}

export interface LoginByEmailForm {
  email: string;
  password: string;
}

export interface LoginByPhoneForm {
  phoneNumber: string;
  otp: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  otp: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}


export interface GoogleLoginPayload {
  name: string;
  email: string;
}

export interface WalletTransaction {
  _id: string;
  userId: string;
  amount: number;
  type: "deposit" | "withdraw";
  createdAt: string;
}