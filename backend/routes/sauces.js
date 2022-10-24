// routes/sauces.js = création du routeur sauce
const express = require('express');
const router = express.Router();
// importation des middleware d'authentification et de gestion des fichiers entrant
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// importation du controlleur sauces
const saucesCtrl = require('../controllers/sauces');

// les routes disponibles pour tout ce qui concerne les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', multer, auth, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', multer, auth, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce);


module.exports = router;