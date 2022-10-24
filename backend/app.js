// app.js =  Création d'une application Express pour notre API
// Déclaration des différents besoin
const express = require('express'); 
const mongoose = require('mongoose');
const path = require('path');
// importation des modèles sauces et users
const Sauce = require('./models/sauces');
const User = require('./models/user');
// importation des routes sauces et users
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
// création de l'application express
const app = express();

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

// ajout des middleware des fichiers (images), sauces et user
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;