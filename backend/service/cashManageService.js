const financialSummaryRecords = require('../models/financialSummaryModel')
const budgetHistoryRecords = require('../models/budgetingHistoryModel')
const budgetingHistoryModel = require('../models/budgetingHistoryModel')

// GET TOTAL CASH
exports.getTotalCash = async () => {
    try {
        const summary = await financialSummaryRecords.find({})
        const totalCash = summary[0]?.totalCash ? summary[0].totalCash : 0
        return totalCash
    } catch (error) {
        console.error(`Error get total cash: ${error.message}`)
    }
}

// GET ALLOCATIONS 
exports.getAllocations = async () => {
    try {
        const allocations = await financialSummaryRecords.findOne({}).select('-totalCash');
        return allocations
    } catch (error) {
        console.error(`Error get allocations: ${error.message}`)
    }
}

// GET BUDGET HISTORY
exports.getBudgetHistory = async () => {
    try {
        const budgetHistory = await budgetHistoryRecords.find({}).sort({ createdAt: -1})
        return budgetHistory;
    } catch (error) {
        console.error(`Error get budget history: ${error.message}`)
    }
}

// ADD NEW BUDGET ALLOCATION
exports.addAllocation = async (data, req) => {
    try {
        const result = await budgetingHistoryModel.create(data)
        if(result){
            const financialSummary = await financialSummaryRecords.find({})
            
            const totalCash = financialSummary[0]?.totalCash ? financialSummary[0].totalCash : 0
            const budgetField = {
                "Operating Expenses": "operatingExpenses",
                "Medical Supplies": "medicalSupplies",
                "Medical Equipments": "medicalEquipments",
                "Staff and Wages": "staffAndWages",
                "Insurance Claims": "insuranceClaims"
            }[data.budgetType];

            if(data.amount >= totalCash){
                const error = new Error("No enough Cash for this budget");
                error.status = 400;
                throw error;
            }

            const updatedTotalCash = await financialSummaryRecords.findOneAndUpdate(
                {},{ $inc: { totalCash: -data.amount, [budgetField]: data.amount } },
                { new: true })
                req.io.emit('total-cash', updatedTotalCash.totalCash)
                req.io.emit('allocations', updatedTotalCash)
        }
        return result;
    } catch (error) {
        console.error(`Error adding budget allocation: ${error.message}`)
        throw new Error('Error Allocating Budget')
    }
}