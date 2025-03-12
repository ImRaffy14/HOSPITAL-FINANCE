const financialService = require('../service/financialService')

// GET CHART OF ACCOUNTS
exports.chartOfAccounts = async (req, res) => {
    try {
        const result = await financialService.chartOfAccounts()
        res.status(200).json(result)
    } catch (error) {
        console.error(`Error Chart Of Accounts: ${error.message}`)
        res.status(500).send()
    }
}

// GET ANALYTICS
exports.analytics = async (req, res) => {
    try {
        const result = await financialService.analytics()
        res.status(200).json(result)
    } catch (error) {
        console.error(`Error Chart Of Accounts: ${error.message}`)
        res.status(500).send()
    }
}