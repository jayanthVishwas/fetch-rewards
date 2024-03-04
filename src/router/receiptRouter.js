const express = require("express");
const router = express.Router();

const receiptController = require("../controller/receiptController");
const checkMiddleWare = require('../middleware/validation');

router.post('/receipts/process', checkMiddleWare, receiptController.addreceipt);
router.get('/receipts/:id/points', checkMiddleWare, receiptController.retrievePoint);

module.exports = router;