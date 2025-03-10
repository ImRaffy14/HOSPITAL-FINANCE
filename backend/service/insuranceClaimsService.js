const insuranceClaimsRecords = require('../models/insuranceClaimsModel')
const financialSummaryRecords = require('../models/financialSummaryModel')

// GET ALL INSURANCE
exports.getInsurance = async () => {
    const result = await insuranceClaimsRecords.find({}).sort({ createdAt: -1})
    return result
}

// ADD NEW CLAIMS
exports.addClaims = async (data, req) => {
    try {
        const summary = await financialSummaryRecords.findOne({})
        if(data.claimAmount >= summary.insuranceClaims){
            const error = new Error('No enough budget for this')
            error.status = 400
            throw error
        }
        const newClaims = await insuranceClaimsRecords.create(data)
        const updatedSummary = await financialSummaryRecords.findOneAndUpdate(
            {},
            { $inc: { insuranceClaims: -newClaims.claimAmount } },
            { new: true }
        )
        req.io.emit('insurance-budget', updatedSummary.insuranceClaims)
        return newClaims
    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}