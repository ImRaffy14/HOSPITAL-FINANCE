const insuranceRecord = require('../models/insuranceClaimsModel')

module.exports = (socket, io) => {

    const handlesNewInsurance = async (data) => {
        const newInsurance = new insuranceRecord({
            claimDate: data.claimDate,
            claimAmount: data.claimAmount,
            claimType: data.claimType,
            description: data.description
        })    

        const savedInsurance = await newInsurance.save()

        if(savedInsurance){
            socket.emit('received-new-insurance', {msg: 'New Insurance Claims Is Recorded!'})

            const result = await insuranceRecord.find({}).sort({ createdAt: -1 })
            io.emit('received-insurance-records', result)
        }
    }

    const getInsuranceRecord = async (data) => {
        const result = await insuranceRecord.find({}).sort({ createdAt: -1 })
        socket.emit('received-insurance-records', result)
    }

    socket.on('add-new-insurance', handlesNewInsurance)
    socket.on('get-insurance-record', getInsuranceRecord)
}