import express from "express";
import { depositOrWithdraw, getBalance, getTransactions } from "../controllers/Wallet.Controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/transactions", verifyToken, getTransactions);
router.get("/balance", verifyToken, getBalance);
router.post("/depositOrWithdraw", verifyToken, depositOrWithdraw);

export default router;