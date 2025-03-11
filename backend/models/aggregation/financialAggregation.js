const budgetRecords = require('../budgetRecordsModel')
const billingRecords = require('../billingModel')

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const startOfMonth = new Date(currentYear, currentMonth, 1);
const endOfMonth = new Date(currentYear, currentMonth + 1, 1);

// LIABILITIES
const liabilities = async () => {
    
    // OPERATING EXPENSES
    const operatingExpenses = await budgetRecords.aggregate([
        {
            $match: {
                status: 'Pending',
                budgetType: 'Operating Expenses',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    // MEDICAL SUPPLIES
    const medicalSupplies = await budgetRecords.aggregate([
        {
            $match: {
                status: 'Pending',
                budgetType: 'Medical Supplies',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    // MEDICAL EQUIPMENTS
    const medicalEquipments = await budgetRecords.aggregate([
        {
            $match: {
                status: 'Pending',
                budgetType: 'Medical Equipments',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    // STAFF AND WAGES
    const staffAndWages = await budgetRecords.aggregate([
        {
            $match: {
                status: 'Pending',
                budgetType: 'Staff and Wages',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    return {
        operatingExpenses: operatingExpenses.length > 0 ? operatingExpenses[0].total : 0,
        medicalSupplies: medicalSupplies.length > 0 ? medicalSupplies[0].total : 0,
        medicalEquipments: medicalEquipments.length > 0 ? medicalEquipments[0].total : 0,
        staffAndWages: staffAndWages.length > 0 ? staffAndWages[0].total : 0
    };
};

// REVENUE
const revenue = async () => {
    
    // RECEIVEABLES
    const receivables = await billingRecords.aggregate([
        {
            $match : {
                paymentStatus: 'Pending',
            }
        },
        {
            $group:{
                _id: null,
                total: { $sum: '$totalAmount'}
            }
        }
    ])

    // REVENUE OF THE MONTH
    const monthRevenue = await billingRecords.aggregate([
        {
            $match: {
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
                paymentStatus: 'Paid',
            }
        },
        {
            $group:{
                _id: null,
                total: { $sum: '$totalAmount'}
            }
        }
    ])

    return {
        receivables: receivables.length > 0 ? receivables[0].total : 0,
        monthRevenue: monthRevenue.length > 0 ? monthRevenue[0].total : 0
    }
}

// EXPENSES
const expenses = async () => {
    
    // OPERATING EXPENSES
    const operatingExpenses = await budgetRecords.aggregate([
        {
            $match: {
                date: { $gte: startOfMonth, $lte: endOfMonth },
                status: 'Approved',
                budgetType: 'Operating Expenses',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    // MEDICAL SUPPLIES
    const medicalSupplies = await budgetRecords.aggregate([
        {
            $match: {
                date: { $gte: startOfMonth, $lte: endOfMonth },
                status: 'Approved',
                budgetType: 'Medical Supplies',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    // MEDICAL EQUIPMENTS
    const medicalEquipments = await budgetRecords.aggregate([
        {
            $match: {
                date: { $gte: startOfMonth, $lte: endOfMonth },
                status: 'Approved',
                budgetType: 'Medical Equipments',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    // STAFF AND WAGES
    const staffAndWages = await budgetRecords.aggregate([
        {
            $match: {
                date: { $gte: startOfMonth, $lte: endOfMonth },
                status: 'Approved',
                budgetType: 'Staff and Wages',
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount'}
            }
        }
    ]);

    return {
        operatingExpenses: operatingExpenses.length > 0 ? operatingExpenses[0].total : 0,
        medicalSupplies: medicalSupplies.length > 0 ? medicalSupplies[0].total : 0,
        medicalEquipments: medicalEquipments.length > 0 ? medicalEquipments[0].total : 0,
        staffAndWages: staffAndWages.length > 0 ? staffAndWages[0].total : 0
    };
}

module.exports = {
    liabilities,
    revenue,
    expenses
};
