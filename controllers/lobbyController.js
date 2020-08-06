const db = require('../models');

// TODO: There needs to be some sort of authentication to prevent normal users
// from being able to modify anything in this database. This should ever only
// be able to be updated by us as the developers

module.exports = {
  createLobby: (req, res) => {
    console.log(req, res);
    db.Lobby
      .create({ roomId: res.params.roomId })
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
      console.log(req.user);
      // db.Lobby
      //   .updateOne({ roomId: req.params.roomId }, { $push: { players: req.params.playerId } })
      //   .then(dbModel => res.json(dbModel))
      //   .catch(err => res.status(422).json(err));
    }
  },

  removePlayer: (req, res) => {
    db.Lobby
      .updateOne({ roomId: req.params.roomId }, { $pull: { players: req.body.playerId } })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};