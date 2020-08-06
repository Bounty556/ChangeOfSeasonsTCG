const db = require('../models');

module.exports = {
  createLobby: (req, res) => {
    db.Lobby
      .create({ roomId: req.params.roomId })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // This doesn't resolve the api call since other things need to be done with this data
  getLobby: (roomId) => {
    return new Promise((resolve, reject) => {
      db.Lobby
        .findOne({ roomId: roomId })
        .then(dbModel => resolve(dbModel.toJSON()))
        .catch(err => reject(err));  
    });  
  },

  addPlayer: (req, res) => {
    if (req.user)
    {
      db.Lobby
        .updateOne({ roomId: req.params.roomId }, { $push: { players: req.user.id } })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
    else {
      res.status(401).json({ error: 'User not authenticated' });
    }
  },

  removePlayer: (req, res) => {
    db.Lobby
      .updateOne({ roomId: req.params.roomId }, { $pull: { players: req.body.playerId } })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};