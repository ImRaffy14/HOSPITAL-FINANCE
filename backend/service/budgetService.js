const budgetRequestRecords = require('../models/budgetRecordsModel')

// GET ALL BUDGET REQUEST RECORDS
exports.getRequest = async () => {
    const result = await budgetRequestRecords.find().sort({ createdAt: -1})
    return result;
}

// ADD BUDGET REQUEST
exports.addRequest = async (data) => {
    try {
        const result = await budgetRequestRecords.create(data)
        return result;
    } catch (error) {
        console.error(`Error adding budget request: ${error.message}`);
        throw new Error(`Error Adding Budget Request`)
    }
}

// UPDATE BUDGET REQUEST
exports.updateRequest = async (id, data) => {
    try {
        const result = await budgetRequestRecords.findByIdAndUpdate(id, data, { new: true })
        return result;
    } catch (error) {
        console.error(`Error Updating Budget Request: ${error.message}`);
        throw new Error(`Request is not found`)
    }
}