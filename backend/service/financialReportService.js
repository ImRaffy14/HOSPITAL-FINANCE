const financialReportRecords = require('../models/financialReportModel')

// GET ALL FINANCIAL REPORTS
exports.getFinancialReport = async () => {
    const result = await financialReportRecords.find({})
    return result
}

// ADD NEW FINANCIAL REPORTS
exports.addFinancialReport = async (data) => {
    try {
        const result = await financialReportRecords.create(data)
        return result
    } catch (error) {
        console.error(`Error adding new financial report: ${error.message}`)
        throw error
    }
}