const express = require('express');
const router = express.Router();
const { home, homeDummy } = require('../controllers/homeController');

router.get('/', home);
router.get('/dummy', homeDummy);

module.exports = router;
