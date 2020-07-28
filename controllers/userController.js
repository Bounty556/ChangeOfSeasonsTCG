const db = require('../models');

module.exports = {
  getUser: (req, res) => {
    db.User
    .findById(req.params.id)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  createUser: (req, res) => {
    db.User
    .create(req.body)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  setUserAvatar: (req, res) => {
    db.User
    .updateOne({ _id: req.params.id }, { avatar: req.body.avatar })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  }
};