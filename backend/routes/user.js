// routes/user.js = création du routeur user
const express = require('express');
const router = express.Router();

// importation du controlleur user
const userCtrl = require('../controllers/user');

// les routes disponibles pour tout ce qui concerne les users
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;