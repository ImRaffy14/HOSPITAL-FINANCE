const billingRecord = require('../models/billingModel')
const budgetingHistoryRecord = require('../models/budgetingHistoryModel')
const budgetRecords = require('../models/budgetRecordsModel')
const financialReportRecords = require('../models/financialReportModel')
const insuranceClaimsRecord = require('../models/insuranceClaimsModel')
const userReocrds = require('../models/UserData')

exports.getData = async () => {
    const billing = await billingRecord.find({})
    const budgetingHistory = await budgetingHistoryRecord.find({})
    const budget = await budgetRecords.find({})
    const financialReport = await financialReportRecords.find({})
    const insuranceClaims = await insuranceClaimsRecord.find({})
    const user = await userReocrds.find({})

    const data = {
        billing,
        budgetingHistory,
        budget,
        financialReport,
        insuranceClaims,
        user
    }

    return data
}