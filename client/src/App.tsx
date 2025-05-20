import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
// import ContactUs from "./pages/ContectUs";
import News from "./pages/News";
import WalletPage from "./pages/Wallet";
import Stock from "./pages/Stock";
import LoginByPhone from "./pages/LoginByPhone";
import LoginByEmail from "./pages/LoginByEmail";
import Signup from "./pages/Signup";
import { TradeProvider } from "./context/context";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import CompanyProfile from "./pages/CompanyProfile";
import GeminiChatbot from "./Chatbot";
import TechnicalAnalysisPage from "./pages/TechnicalAnalysisPage";
import Marketplace from "./pages/Marketplace";
import ProtectedRoute from "./components/Protected";
// import TradingWidgets from "./components/TradingWidgets";

function App() {
  let geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <TradeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login/phone" element={<LoginByPhone />} />
          <Route path="/login/email" element={<LoginByEmail />} />
          {/* <Route path="/contact" element={<ContactUs />} /> */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route path="/news" element={<News />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock/:stockName"
            element={
              <ProtectedRoute>
                <Stock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technical-analysis/:stockName"
            element={
              <ProtectedRoute>
                <TechnicalAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/:companyName"
            element={
              <ProtectedRoute>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
        </Routes>
        <GeminiChatbot apiKey={geminiApiKey} />
        <Footer />
      </Router>
      {/* <TradingWidgets></TradingWidgets> */}
    </TradeProvider>
  );
}

export default App;
