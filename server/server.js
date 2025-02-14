import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import connectDB from "./db/index.js";
import cors from "cors";
import stocksRoutes from "./routes/stocksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectSocket from "./lib/socketio.js";
import stockRoutes from "./routes/stockRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js';

const PORT = process.env.PORT || 3000;
const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use("/api/stocks", stocksRoutes);
app.use("/api", orderRoutes);
app.use("/api/v1", authRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>this is server</h1>`);
});

// Mount stock routes
app.use("/api/stocks", stockRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});
app.use('/api/v1', authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", portfolioRoutes);

const server = http.createServer(app);

await connectSocket(server);


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
