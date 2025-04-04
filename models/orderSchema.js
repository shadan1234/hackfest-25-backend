import mongoose from "mongoose";

const StockOrderSchema = new mongoose.Schema({
  stockid: { type: String, required: true },
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  orderType: { type: String, enum: ["buy", "sell"], required: true },
  totalAmount: { type: Number, required: true }
});

const MutualFundOrderSchema = new mongoose.Schema({
  fundCode: { type: String, required: true },
  fundName: { type: String, required: true },
  units: { type: Number },
  nav: { type: Number },
  amount: { type: Number, required: true },
  orderType: { type: String, enum: ["buy", "sell", "sip"], required: true }
});

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  brokerName: { type: String, required: true },
  accountId: { type: String, required: true },
  orderType: { 
    type: String, 
    enum: ["stock", "mutualFund"], 
    required: true 
  },
  stockDetails: StockOrderSchema,
  mutualFundDetails: MutualFundOrderSchema,
  status: { 
    type: String, 
    enum: ["pending", "processing", "completed", "failed", "cancelled"], 
    default: "pending" 
  },
  orderReference: { type: String },
  transactionDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema); 