import User from "../models/User.Model.js";
import WalletTransaction from "../models/WalletTransaction.Model.js";

export const depositOrWithdraw = async (req, res) => {
    const { type, amount, note } = req.body;
    const userId = req.user.id;

    if (!["deposit", "withdrawal"].includes(type)) {
        return res.status(400).json({ message: "Invalid transaction type" });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let newBalance = user.virtualBalance;

        if (type === "deposit") {
            newBalance += amount;
        } else if (type === "withdrawal") {
            if (user.virtualBalance < amount) {
                return res.status(400).json({ message: "Insufficient balance" });
            }
            newBalance -= amount;
        }

        user.virtualBalance = newBalance;
        await user.save();

        const transaction = new WalletTransaction({
            user: userId,
            type,
            amount,
            balanceAfter: newBalance,
            note,
        });

        await transaction.save();

        res.status(200).json({
            message: `${type} successful`,
            updatedBalance: newBalance,
            transaction,
        });
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTransactions = async (req, res) => {
    const userId = req.user.id;

    try {
        const transactions = await WalletTransaction.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Fetch transactions error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ balance: user.virtualBalance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};