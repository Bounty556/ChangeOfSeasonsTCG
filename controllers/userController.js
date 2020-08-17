const db = require('../models');
const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = {
  getUser: id => {
    return new Promise((resolve, reject) => {
      db.User.findById(id)
        .then(dbModel => resolve(dbModel.toJSON()))
        .catch(err => reject(err));
    });
  },

  createUser: (req, res) => {
    req.body.password = hashPassword(req.body.password);

    db.User.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  setUserAvatar: (req, res) => {
    db.User.updateOne({ _id: req.params.id }, { avatar: req.params.avatar })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  getDeck: (req, res) => {
    db.User.findById(req.params.id)
      .then(user => {
        db.Card.find({ cardId: { $in: user.cardIds } })
          .then(cards => res.json(cards))
          .catch(err => res.status(422).json(err));
      })
      .catch(err => res.status(422).json(err));
  },

  setDeck: (req, res) => {
    db.Card.find({ season: req.params.season })
      .then(cards => {
        const cardIds = cards.map(x => x.cardId);
        db.User.findByIdAndUpdate(req.params.id, { cardIds: cardIds })
          .then(user => res.json(user))
          .catch(err => res.status(422).json(err));
      })
      .catch(err => res.status(422).json(err));
  },

  addWin: (req, res) => {
    db.User.updateOne({ _id: req.params.id }, { $inc: { wins: 1 } })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  addLoss: (req, res) => {
    db.User.updateOne({ _id: req.params.id }, { $inc: { losses: 1 } })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};