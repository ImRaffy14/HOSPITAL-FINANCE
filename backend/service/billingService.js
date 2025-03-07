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