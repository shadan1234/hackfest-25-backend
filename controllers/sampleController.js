import Holdings from "../models/holdingsSchema.js";

// Add a new stock to user's holdings
export const addStock = async (req, res) => {
  const { userId, brokerName, accountId, stockData } = req.body;
  
  try {
    // Find user's holdings
    let userHoldings = await Holdings.findOne({ userId });
    
    // If user doesn't have holdings yet, create new
    if (!userHoldings) {
      userHoldings = new Holdings({
        userId,
        accounts: [],
        totalPortfolioValue: 0
      });
    }
    
    // Find the specific broker account
    let account = userHoldings.accounts.find(acc => 
      acc.brokerName === brokerName && acc.accountId === accountId
    );
    
    // If account doesn't exist, create it
    if (!account) {
      account = {
        brokerName,
        accountId,
        stocks: [],
        mutualFunds: [],
        totalValue: 0
      };
      userHoldings.accounts.push(account);
    } else {
      // Get the account from the array to update it
      account = userHoldings.accounts.id(account._id);
    }
    
    // Add the new stock to the account
    account.stocks.push({
      stockid: stockData.stockid,
      companyName: stockData.companyName,
      quantity: stockData.quantity,
      averageCost: stockData.averageCost,
      currentValue: stockData.currentValue,
      lastUpdated: new Date()
    });
    
    // Update account total value
    account.totalValue = calculateAccountTotal(account);
    
    // Update portfolio total value
    userHoldings.totalPortfolioValue = calculatePortfolioTotal(userHoldings.accounts);
    
    // Save the updated holdings
    await userHoldings.save();
    
    res.status(200).json({
      success: true,
      message: "Stock added successfully",
      data: userHoldings
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to add stock"
    });
  }
};

// Helper functions
const calculateAccountTotal = (account) => {
  const stocksTotal = account.stocks.reduce((sum, stock) => sum + stock.currentValue, 0);
  const fundsTotal = account.mutualFunds.reduce((sum, fund) => sum + fund.currentValue, 0);
  return stocksTotal + fundsTotal;
};

const calculatePortfolioTotal = (accounts) => {
  return accounts.reduce((sum, account) => sum + account.totalValue, 0);
};

// Get all stocks for a specific user account
export const getStocks = async (req, res) => {
  const { userId, brokerName, accountId } = req.params;
  
  try {
    const userHoldings = await Holdings.findOne({ userId });
    
    if (!userHoldings) {
      return res.status(404).json({
        success: false,
        message: "Holdings not found for user"
      });
    }
    
    const account = userHoldings.accounts.find(acc => 
      acc.brokerName === brokerName && acc.accountId === accountId
    );
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }
    
    res.status(200).json({
      success: true,
      stocks: account.stocks
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stocks"
    });
  }
};
