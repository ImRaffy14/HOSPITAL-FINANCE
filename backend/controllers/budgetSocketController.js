const budgetRecord = require('../models/budgetRecordsModel')


module.exports = (socket, io) => {

    const handlesAddBudget = async (data) => {
        const newRecord = new budgetRecord({
            date: data.date,
            amount: data.amount,
            budgetType: data.budgetType
        })

        const savedRecord = await newRecord.save()

        if(savedRecord){
            socket.emit('received-new-budget', {msg: 'New Budget Recorded!'})

            const result = await budgetRecord.find({}).sort({ createdAt: -1})
            io.emit('received-budget-records', result)

        }else{
            socket.emit('error-budget-record',{msg: 'Error Recording New Budget.'})
        }
    }

    const getBudgetRecords = async (data) => {
        const result = await budgetRecord.find({}).sort({ createdAt: -1})
        socket.emit('received-budget-records', result)
    }

    socket.on('add-budget', handlesAddBudget)
    socket.on('get-budget-records', getBudgetRecords)
}