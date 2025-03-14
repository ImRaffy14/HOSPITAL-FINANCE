const aiSupportService = require('../service/aiSupportService')

// PROMPT TO AI
exports.promptToAi = async (req, res) => {
    try {
        const { query } = req.body
        const result = await aiSupportService.prompt(query)
        res.status(200).json(result)
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'An Internal Error' })
    }
}