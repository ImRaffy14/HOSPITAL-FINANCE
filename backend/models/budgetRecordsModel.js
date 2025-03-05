const mongoose = require('mongoose')

const schema = mongoose.Schema

const budgetRecordSchema = new schema ({
    date: { type: String, required: true},
    amount: { type: Number, required: true},
    budgetType: { type: String, required: true}
}, { timestamps: true })

module.exports = mongoose.model('budgetRecord', budgetRecordSchema)