const budgetController = require('../controllers/budgetController')
const express = require('express')

const router = express.Router()

// GET ALL REQUEST
router.get('/get-requests', budgetController.getRequests)

// ADD NEW REQUEST
router.post('/add-request', budgetController.addRequest)

module.exports = router