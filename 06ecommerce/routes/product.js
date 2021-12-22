const express = require('express');
const { testProduct } = require('../controllers/productController');
const { isLoggedIn, customRole } = require('../middlewares/user');

const router = express.Router();

router.get('/product/test', testProduct);

module.exports = router;
