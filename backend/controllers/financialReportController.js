const financialReportService = require('../service/financialReportService')

exports.getFinancialReports = async (req, res) => {
    try {
        const result = await financialReportService.getFinancialReport()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).send()
    }
}

exports.addNewFinancialReport = async (req, res) => {
    try {
        const result = await financialReportService.addFinancialReport(req.body)
        res.status(200).json({ status: 'success', message: 'Financial report added successfully' })
        req.io.emit('financial-report', result)
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'An Internal Error'})
    }
}