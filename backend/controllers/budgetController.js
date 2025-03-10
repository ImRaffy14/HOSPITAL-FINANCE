const budgetService = require('../service/budgetService')

// GET ALL REQUEST BUDGETS
exports.getRequests = async (req, res) => {
    try {
        const data = await budgetService.getRequest()
        res.status(200).json({
            status: 'success',
            requests: data
        })
    } catch (error) {
        res.status(500).send()
    }
}

// ADD NEW REQUEST
exports.addRequest = async (req, res) => {
    try {
        const result = await budgetService.addRequest(req.body);
        res.status(200).json({
            status: 'success',
            message: `Budget for ${result.budgetType} is created`
        })
        req.io.emit('added-request', result)
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

// UPDATE BUDGET REQUEST
exports.updateRequest = async (req, res) => {
    try {
        const updateData = await budgetService.updateRequest(req.params.id, req.body, req)
        res.status(200).json({
            status: 'success',
            message: `Budget Request for ${updateData._id} is now updated`
        })
        req.io.emit('update-request', updateData)
    } catch (error) {
        res.status(error.status || 500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
}