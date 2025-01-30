import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
