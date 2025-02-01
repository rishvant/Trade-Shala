import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/login";
import Navbar from "./components/Navbar";
import ContactUs from "./pages/ContectUs";
import News from "./pages/News";
import Wallet from "./pages/Wallet";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;
