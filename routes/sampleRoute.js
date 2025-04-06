import express from "express";
import { addStock, getStocks } from "../controllers/sampleController.js";
import { verifyToken } from "../auth/verifyToken.js";

const router = express.Router();

// Routes with authentication middleware
router.post("/stocks", verifyToken, addStock);
router.get("/stocks/:userId/:brokerName/:accountId", verifyToken, getStocks);

export default router;
