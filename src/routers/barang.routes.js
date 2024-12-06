const express = require('express');
const {passport, authenticateJWT} = require('../passport');

const { addBarang, tambahBarang, deleteBarang, getBarang, editBarang} = require('../controllers');
const addBarangValidation = require('../middlewares/validation/barang/AddBarangValidation');
const tambahBarangValidation = require('../middlewares/validation/barang/TambahBarangValidation');
const editBarangValidation = require('../middlewares/validation/barang/EditBarangValidation');

const router = express.Router();

router.get('/barang', authenticateJWT, getBarang);
router.post('/barang', authenticateJWT , addBarangValidation ,addBarang);
router.delete('/barang/:id', authenticateJWT, deleteBarang);
router.put('/barang/:id', authenticateJWT, editBarangValidation ,editBarang);
router.put('/stock/:id', authenticateJWT, tambahBarangValidation ,tambahBarang);

module.exports = router;