const db = require('../models');
const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = {
  getUser: (req, res) => {
    db.User
    .findById(req.params.id)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  createUser: (req, res) => {
    req.body.password = hashPassword(req.body.password);

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