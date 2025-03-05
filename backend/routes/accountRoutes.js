const express = require('express')
const accountController = require('../controllers/accountController')

const router = express.Router()


router.get('/get-accounts', accountController.getAccounts)
router.patch('/update-account/:id', accountController.updateAccount)

module.exports = router