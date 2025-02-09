import mongoose from "mongoose";


const PortfolioSchema = new mongoose.Schema(
  {
    userId: {

      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalValue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
PortfolioSchema.index({ totalValue: -1 }); // For sorting portfolios by value
PortfolioSchema.index({ updatedAt: -1 }); // For finding recently updated portfolios

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
export default Portfolio;
