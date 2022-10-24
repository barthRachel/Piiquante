// auth.js = middleware pour sécuriser la connexion d'un user
// importation du package jsonwebtoken pour créer et vérifier les tokens
const jwt = require('jsonwebtoken'); 
 
// middleware qui va vérifier que l'user est bien connecté + transmettre
// les informations de connexion aux méthodes
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};