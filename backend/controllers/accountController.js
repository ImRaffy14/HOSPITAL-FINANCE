const accountRecords = require('../models/UserData')

// GET ACCOUNTS
const getAccounts = async (req, res) => {
    const result = await accountRecords.find({})
    res.status(200).json(result)
}


module.exports = {
    getAccounts,
}