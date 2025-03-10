const billingRecords = require('../models/billingModel');
const financialSummaryRecords = require('../models/financialSummaryModel')

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

exports.updateBilling = async (id, data, req) => {
    try {
        const checkBill = await billingRecords.findById(id);
        if (!checkBill) {
            const error = new Error("Billing record not found");
            error.status = 404;
            throw error;
        }

        if (checkBill.paymentStatus === "Paid") {
            const error = new Error("This Billing is Already Processed");
            error.status = 400;
            throw error;
        }

        const updatedBilling = await billingRecords.findByIdAndUpdate(id, data, { new: true });
        
        if (updatedBilling.paymentStatus === "Paid") {
            let fetchTotalCash = await financialSummaryRecords.findOne({});

            if (fetchTotalCash) {
                let totalCash = fetchTotalCash.totalCash || 0;
                const result = await financialSummaryRecords.findByIdAndUpdate(
                    fetchTotalCash._id,
                    { totalCash: totalCash + updatedBilling.totalAmount },
                    { new: true }
                );
                req.io.emit('total-cash', result.totalCash)
            } else {
                const result = await financialSummaryRecords.create({
                    totalCash: data.totalAmount,
                    operatingExpenses: 0,
                    staffAndWages: 0,
                    medicalSupplies: 0,
                    medicalEquipments: 0,
                    insuranceClaims: 0
                });
                req.io.emit('total-cash', result.totalCash)
            }
        }

        return updatedBilling;
    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
};
