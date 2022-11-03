// controllers/user.js = controlleur des users
// importation du modèle User
const User = require('../models/user');
const jwt = require('jsonwebtoken'); //token d'authentificatioon
const bcrypt = require('bcrypt'); //hasher le mot de passe
const cryptoJs = require('crypto-js'); //chiffrer l'email
//const sanitize = require('express-mongo-sanitize'); //empêcher les attaques d'injection SQL
console.log(process.env.KEY)
// création des méthodes atribuées aux routes user
// méthode qui permets à un user de s'enregistrer
exports.signup = (req, res, next) => {

    //const verifInfos = sanitize(req.body.email);
    console.log(req.body.email);

    // on chiffre l'email de l'user avant l'envoie dans la base de données
    const encryptedMail = cryptoJs.HmacSHA256(req.body.email, process.env.KEY).toString();

    bcrypt.hash(req.body.password, 10) //hachage du mdp 10 fois
        .then(hash => {
            const user = new User({
                email: encryptedMail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
      .catch(error => res.status(500).json({ error }));
};


// méthode qui permets à un user de se connecter
exports.login = (req, res, next) => {
    
    const decryptedMail = cryptoJs.HmacSHA256(req.body.email, process.env.KEY).toString();

    User.findOne({ email: decryptedMail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};