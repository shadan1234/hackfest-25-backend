import mongoose from "mongoose";

const BrokerAccountSchema = new mongoose.Schema({
  brokerName: { type: String, required: true },
  accountId: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number },
  linkedAccounts: [BrokerAccountSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema); 