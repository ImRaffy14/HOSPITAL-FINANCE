const billingRecords = require('../models/billingModel');

// GET ALL BILLING RECORDS
exports.getBillings = async () => {
    const billings = await billingRecords.find().sort({ createdAt: -1 });
    return billings;
}

// ADD NEW BILLING RECORD
exports.newBilling = async (data) => {
    try {
        const newBilling = await billingRecords.create(data);
        return newBilling;
    } catch (error) {
        console.error('Error Adding Billing Record: ', error.message);
        throw new Error('Error Adding Billing Records');
    }
}

// UPDATE BILLING RECORD
exports.updateBilling = async (id, data) => {
    try {
        const updatedBilling = await billingRecords.findByIdAndUpdate(id, data, { new: true });
        return updatedBilling;
    } catch (error) {
        console.error('Error updating Billing Record: ', error.message);
        throw new Error('Data not found');
    }
}