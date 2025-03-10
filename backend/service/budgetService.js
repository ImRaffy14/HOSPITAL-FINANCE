const budgetRequestRecords = require('../models/budgetRecordsModel')
const financialSummaryRecords = require('../models/financialSummaryModel')

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
exports.updateRequest = async (id, data, req) => {
    try {
        const budgetField = {
            "Operating Expenses": "operatingExpenses",
            "Medical Supplies": "medicalSupplies",
            "Medical Equipments": "medicalEquipments",
            "Staff and Wages": "staffAndWages",
            "Insurance Claims": "insuranceClaims"
        }[data.budgetType];

        const checkRequest = await budgetRequestRecords.findById(id)
        if(checkRequest.status === 'Approved' || checkRequest.status === 'Rejected'){
            const error = new Error('This Request is already processed')
            error.status = 400;
            throw error;
        }
        if(data.status === 'Approved'){
            const summary = await financialSummaryRecords.findOne({})
            const allocated = summary[budgetField]
            if(data.amount >= allocated){
                const error = new Error('No enough budget for this request')
                error.status = 400
                throw error;
            }
        }
        const result = await budgetRequestRecords.findByIdAndUpdate(id, data, { new: true })
        if(result.status === "Approved"){
            const summary = await financialSummaryRecords.findOneAndUpdate(
                {},
                { $inc: { [budgetField]: -result.amount }},
                {new: true}
            )
            req.io.emit('allocations', summary)
        }
        return result;
    } catch (error) {
        console.error(`Error Updating Budget Request: ${error.message}`);
        error.status = error.status || 500;
        throw error;
    }
}