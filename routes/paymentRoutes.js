const express = require('express');
const router = express.Router();
const {
  getPayments,
  processPayment,
  getPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');

router.route('/')
  .get(getPayments)
  .post(processPayment);

router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;