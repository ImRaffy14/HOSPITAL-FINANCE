const billingRecords = require('../billingModel')

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const startOfMonth = new Date(currentYear, currentMonth, 1);
const endOfMonth = new Date(currentYear, currentMonth + 1, 1);


// GET CASH FLOW SPECIFIC MONTH
const cashFlow = async () => {

    const records = await billingRecords.aggregate([
        {
            $match: {
                updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
                paymentStatus: 'Paid'
            }
        }
    ])

    return records;

}

module.exports = cashFlow