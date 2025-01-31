import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import connectDB from "./db/index.js";
import stocksRoutes from "./routes/stocksRoutes.js";

const PORT = process.env.PORT || 3000;

const app = express();
connectDB();
app.use(express.json());

app.use("/api/stocks", stocksRoutes);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});