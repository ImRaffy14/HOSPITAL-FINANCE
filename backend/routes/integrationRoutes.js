const integrationController = require('../controllers/integrationController')
const express = require('express')

const router = express.Router()

router.get('/get-data', integrationController.getAllData)

module.exports = router