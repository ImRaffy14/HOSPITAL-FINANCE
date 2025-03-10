const insuranceClaimsService = require('../service/insuranceClaimsService')

// GET ALL HISTORY
exports.getInsuranceHistory = async (req, res) => {
    const history = await insuranceClaimsService.getInsurance()
    res.status(200).json(history)
}

// ADD NEW CLAIMS
exports.addNewClaims = async (req, res) => {
    try {
        const result = await insuranceClaimsService.addClaims(req.body, req)
        res.status(201).json({
            status: 'success',
            message: 'New claim added successfully',
        })
        req.io.emit('new-claim', result)
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'An Internal Error'})
    }
}