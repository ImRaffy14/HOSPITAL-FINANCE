const billingService = require('../service/billingService');

exports.getBilling = async (req, res) => {
    try {
        const billings = await billingService.getBillings();
        res.status(200).json({
            status: 'success',
            billings
        })
    } catch (error) {
        res.status(500).send;
    }
}

exports.newBilling = async (req, res) => {
    try {
        const newBilling = await billingService.newBilling(req.body);
        res.status(200).json({
            status: 'success',
        })
        req.io.emit('new-billing', newBilling);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}