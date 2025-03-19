const integrationService = require('../service/integrationService')

exports.getAllData = async (req, res) => {
    const result = await integrationService.getData()
    res.status(200).json(result)
}