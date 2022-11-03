// app.js =  Création d'une application Express pour notre API
// Déclaration des différents besoin
const express = require('express'); 
const mongoose = require('mongoose');
const path = require('path');

//importation package dotenv pour la clé secrète du cryptage d'e-mail
require('dotenv').config()

// importation des modèles sauces et users
const Sauce = require('./models/sauces');
const User = require('./models/user');
// importation des routes sauces et users
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// importation de mongo-sanitize pour éviter les injections SQL
const sanitize = require('express-mongo-sanitize');

// importation de helmet pour éviter les attaques XSS
const helmet = require('helmet');

//importation de express-rate-limit contre les attaques brute force
const rateLimit = require('express-rate-limit')


// création de l'application express
const app = express();
//configuration de la limitation des requetes par fenêtres
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limite chaque IP à 100 requêtes par fenêtre toutes les 15 minutes
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// connection avec la base de données MongoDB 
mongoose.connect('mongodb+srv://root:root@atlascluster.ncdxhbw.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// gestion des erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(sanitize());

// ajout des middleware des fichiers (images), sauces et user
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// ajout du middleware associé à helmet 
app.use(helmet());

// ajout du middleware associé à express-rate-limit
app.use('/api', apiLimiter)

module.exports = app;