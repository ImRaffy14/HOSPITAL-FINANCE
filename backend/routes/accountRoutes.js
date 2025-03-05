const express = require('express')
const { getAccounts } = require('../controllers/accountController')
const router = express.Router()

router.get('/get-accounts', getAccounts)

module.exports = router