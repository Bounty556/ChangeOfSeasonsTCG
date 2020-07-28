const db = require('../models');

// TODO: There needs to be some sort of authentication to prevent normal users
// from being able to modify anything in this database. This should ever only
// be able to be updated by us as the developers

module.exports = {
  addCard: (req, res) => {
    db.Card
    .create(req.body)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  removeCardByCardId: (req, res) => {
    db.Card
    .deleteOne({ cardId: req.params.id })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  getCardByCardId: (req, res) => {
    db.Card
    .findOne({ cardId: req.params.id })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  getCardsBySeason: (req, res) => {
    db.Card
    .find({ season: req.params.season })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  }
};