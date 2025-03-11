const { 
    liabilities,
    revenue,
    expenses
} = require('../models/aggregation/financialAggregation')
const financialSummary = require('../models/financialSummaryModel')

// GET CHART OF ACCOUNTS
exports.chartOfAccounts = async () => {
    const resultLiabilites = await liabilities()
    const resultRevenue = await revenue()
    const resultExpenses = await expenses()
    const resultAsset = await financialSummary.findOne({})
    const assets = {
        totalAssets: resultAsset.totalCash,
        receivables: resultRevenue.receivables
    }
    const equity = {
        totalEquity: (
            assets.totalAssets + assets.receivables
            )
            - 
            (resultLiabilites.operatingExpenses +
            resultLiabilites.medicalSupplies +
            resultLiabilites.medicalEquipments +
            resultLiabilites.staffAndWages)
    }
    
    const data = {
        liabilites: resultLiabilites,
        revenue: resultRevenue.monthRevenue,
        expenses: resultExpenses,
        assets,
        equity
    }
    return data
}