const express = require('express');

const userRoutes = require('./user.routes');
const barangRoutes = require('./barang.routes');
const orderRoutes = require('./order.routes');

const router = express.Router();

router.use('', userRoutes);
router.use('', barangRoutes);
router.use('', orderRoutes);


module.exports = router;