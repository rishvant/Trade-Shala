import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ContactUs from "./pages/ContectUs";
import News from "./pages/News";
import WalletPage from "./pages/Wallet";
import Stock from "./pages/Stock";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/stock/:stockName" element={<Stock />} />
      </Routes>
    </Router>
  );
}

export default App;
