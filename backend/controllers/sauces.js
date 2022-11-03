// controllers/sauces.js = controlleur des sauces
// importation du modèle Sauce
const Sauce = require('../models/sauces');
const fs = require('fs');

// création des méthodes atribuées aux routes sauces
// méthode qui permets l'ajout d'une sauce par un user
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLikes: [],
      usersDisliked: []
    });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
  .catch(error => { res.status(400).json( { error })})
};

//méthode qui permets d'afficher la sauce sur laquelle un user clique
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// méthode qui permet à un user de modifier une sauce qu'il a ajouter
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(403).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// méthode qui permets à un user de supprimer une sauce qu'il a ajouter
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// méthode qui permets à un user de liker - disliker - annuler son like/dislike sur une sauce (même celle qu'on a add nous même)
exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    if (req.body.like === 1) {
      if (sauce.usersLiked.includes(req.body.userId)) 
      {
        res.status(401).json({error: 'Sauce déja liké'});
      }
      else
      {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
          .catch(error => res.status(400).json({ error }))
      }

    } 
    else if (req.body.like === -1) {
      if (sauce.usersDisliked.includes(req.body.userId)) {
        res.status(401).json({error: 'Sauce déja disliké'});
      }
      else
      {   
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch(error => res.status(400).json({ error }));
        }
    } 
    else 
    {
      if (sauce.usersLiked.includes(req.body.userId)) 
      {
        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
          .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
          .catch(error => res.status(400).json({ error }));
      } 
      else if (sauce.usersDisliked.includes(req.body.userId)) 
      {
        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
          .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
          .catch(error => res.status(400).json({ error }));
        }
    }
  })
  .catch(error => res.status(400).json({ error }));
};

// méthode qui permets d'afficher toutes les sauces du site
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}
