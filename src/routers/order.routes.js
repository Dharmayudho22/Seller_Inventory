const express = require('express');
const {passport, authenticateJWT} = require('../passport');

const { getOrder, decideOrder } = require('../controllers');
const OrderValidation = require('../middlewares/validation/order/OrderValidation');

const router = express.Router();

router.get('/order', authenticateJWT, getOrder);
router.put('/order', authenticateJWT, OrderValidation ,decideOrder);

module.exports = router;