const userControllers = require('./user.controller');
const barangControllers = require('./barang.controller');
const orderControllers = require('./order.controller');

module.exports = {
  ...userControllers,
  ...barangControllers,
  ...orderControllers,
};