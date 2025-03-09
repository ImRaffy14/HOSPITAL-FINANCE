const mongoose = require('mongoose')

const schema = mongoose.Schema

const financialSummarySchema = new schema({
    totalCash: { type: Number, default: 0, required: true},
    operatingExpenses: { type: Number, default: 0, required: true },
    staffAndWages: { type: Number, default: 0, required: true },
    medicalSupplies: { type: Number, default: 0, required: true },
    medicalEquipments: { type: Number, default: 0, required: true },
    insuranceClaims: { type: Number, default: 0, required: true },
})

module.exports = mongoose.model('FinancialSummary', financialSummarySchema)