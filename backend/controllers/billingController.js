const billingService = require('../service/billingService');

// GET ALL BILLING RECORDS
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

// ADD NEW BILLING RECORD
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


// UPDATE BILLING RECORD
exports.updateBilling = async (req, res) => {
    try {
        const updatedBilling = await billingService.updateBilling(req.params.id, req.body, req);
        res.status(200).json({
            status: 'success',
        })
        req.io.emit('update-billing', updatedBilling);
    } catch (error) {
        res.status(error.status || 500).json({ status: "error", message: error.message || "Internal Server Error" }); 
    }
}