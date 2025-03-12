const { 
    liabilities,
    revenue,
    expenses
} = require('../models/aggregation/financialAggregation')
const financialSummary = require('../models/financialSummaryModel')
const cashFlow  = require('../models/aggregation/analyticsAggregation')


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

// GET ANALYTICS
exports.analytics = async () => {
    const resultLiabilites = await liabilities()
    const result = await cashFlow()
    const resultRevenue = await revenue()
    const resultAsset = await financialSummary.findOne({})
    const data = {
        cashFlow: result,
        totalCash: resultAsset.totalCash,
        receivables: resultRevenue.receivables,
        payables:   resultLiabilites.operatingExpenses +
                    resultLiabilites.medicalSupplies +
                    resultLiabilites.medicalEquipments +
                    resultLiabilites.staffAndWages
    }
    return data
}