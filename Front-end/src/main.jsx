import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {TradeProvider} from "./context/context.jsx"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TradeProvider>
      <App />
    </TradeProvider>
  </StrictMode>
);
