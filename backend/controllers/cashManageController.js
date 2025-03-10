const cashManageService = require('../service/cashManageService')

// GET TOTAL CASH
exports.getTotalCash = async (req, res) => {
    try {
        const totalCash = await cashManageService.getTotalCash()
        res.status(200).json({
            status:"success",
            totalCash
        })
    } catch (error) {
        res.status(500).send()
    }
}

// GET BUDGET HISTORY
exports.getBudgetHistory = async (req, res) => {
    try {
        const budgetHistory = await cashManageService.getBudgetHistory()
        res.status(200).json(budgetHistory)
    } catch (error) {
        res.status(500).send()
    }
}

// GET ALLOCATIONS
exports.getAllocations = async (req, res) => {
    try {
        const allocations = await cashManageService.getAllocations()
        res.status(200).json({
            status: "success",
            allocations
        })
    } catch (error) {
        res.status(500).send()
    }
}

// ADD NEW BUDGET ALLOCATION
exports.addBudgetAllocation = async (req, res) => {
    try {
        const allocation = await cashManageService.addAllocation(req.body, req)
        res.status(200).json({
            status: "success",
            message: `Budget allocation for ${allocation.budgetType} is added`,
        })
        req.io.emit('budgeting', allocation)
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}