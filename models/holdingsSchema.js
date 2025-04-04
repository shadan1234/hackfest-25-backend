import mongoose from "mongoose";

const StockHoldingSchema = new mongoose.Schema({
    stockid: { type: String, required: true },
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true },
  averageCost: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

const MutualFundHoldingSchema = new mongoose.Schema({
  fundCode: { type: String, required: true },
  fundName: { type: String, required: true },
  units: { type: Number, required: true },
  averageNavCost: { type: Number, required: true },
  currentNav: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

const AccountHoldingsSchema = new mongoose.Schema({
  brokerName: { type: String, required: true },
  accountId: { type: String, required: true },
  stocks: [StockHoldingSchema],
  mutualFunds: [MutualFundHoldingSchema],
  totalValue: { type: Number, required: true },
  lastRefreshed: { type: Date, default: Date.now }
});

const HoldingsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  accounts: [AccountHoldingsSchema],
  totalPortfolioValue: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Holdings", HoldingsSchema); 